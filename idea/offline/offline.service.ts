import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import Async = require('async');

import { IDEAAWSAPIService, CacheModes } from '../AWSAPI.service';
import { epochDateTime } from 'idea-toolbox';

/**
 * After how much time the offline cached content needs a refresh.
 */
export const SYNC_EXPIRATION_INTERVAL: number = 1000 * 60 * 60 * 24; // a day
/**
 * Prefix of an online resource name, for the local storage.
 */
export const OFFLINE_RESOURCE_KEY_PREFIX: string = 'IDEAOfflineService.offlineResource.';
/**
 * Id of the last sync time info in the local storage.
 */
export const LAST_SYNC_KEY: string = 'IDEAOfflineService.lastSyncAt';

/**
 * Manage the offline functioning of the app (upload/download/synchronization).
 *
 * Download: it works through the `mAt` mechanism on back-end resources.
 *
 * **How to use it**. Configure the sync mechanism in the main app.component as it follows
 *    1. set the resources to cache offline.
 *    2. set the offline resources (the ones that you can create offline).
 *    3. run a synchronization
 *    4. optionally, enable the offline manager (UI).
 * e.g.
 ```
  // set the resources we want to download from the back-end
  this.offline.resourcesToCache = [
    new CacheableResource('trainingModels', 'trainingModelId', this.t.instant('MENU.MODELS')),
    new CacheableResource('trainings', 'trainingId', this.t.instant('MENU.TRAININGS'))
  ];
  // set the resources that create offline content, to upload it
  this.offline.setOfflineResources([
    new OfflineResource('trainings', this.t.instant('MENU.TRAININGS'))
  ])
  .then(() => this.offline.synchronizeIfNeeded());
 ```
 */
@Injectable()
export class IDEAOfflineService {
  /**
   * True/false if the platform is offline/online.
   */
  public isOffline: boolean;
  /**
   * True when running a general synchronization.
   */
  public synchronizing: boolean;
  /**
   * The timestamp of the last general synchronization.
   */
  public lastSyncAt: epochDateTime;
  /**
   * True if an error happened in the last general synchronization.
   */
  public errorInLastSync: boolean;

  /**
   * The array of the resources created offline, to upload in the back-end.
   */
  protected offlineResources: Array<OfflineResource>;
  /**
   * The array of resources to cache offline from the back-end.
   */
  public resourcesToCache: Array<CacheableResource>;

  constructor(
    protected storage: Storage,
    protected t: TranslateService,
    protected API: IDEAAWSAPIService
  ) {
    this.isOffline = !navigator.onLine;
    window.addEventListener('online',  () => this.isOffline = false);
    window.addEventListener('offline', () => this.isOffline = true);
    this.synchronizing = false;
    this.errorInLastSync = false;
    this.offlineResources = new Array<OfflineResource>();
    this.resourcesToCache = new Array<CacheableResource>();
    this.storage.get(LAST_SYNC_KEY)
    .then((lastSyncAt: number) => this.lastSyncAt = lastSyncAt || 0);
  }

  /**
   * Set the offline resources and load their elements (to upload) from the local storage.
   */
  public setOfflineResources(resources: Array<OfflineResource>): Promise<void> {
    return new Promise((resolve) => {
      this.offlineResources = resources;
      // acquire the resource elements from the offline storage, in order to upload them
      Async.each(this.offlineResources, (resource: OfflineResource, done: any) => {
        this.storage.get(OFFLINE_RESOURCE_KEY_PREFIX.concat(resource.name))
        .then((elements: Array<Object>) => {
          resource.elementsToUpload = elements || new Array<Object>();
          done();
        });
      }, () => resolve());
    });
  }
  /**
   * Check in the local storage for the elements of each offline resource and try to upload them.
   */
  protected uploadOfflineResource(resource: OfflineResource): Promise<void> {
    return new Promise((resolve, reject) => {
      resource.synchronizing = true;
      resource.error = false;
      // upload the elements of the current resource
      Async.each(resource.elementsToUpload, (element: Object, doneEl: any) => {
        // upload the current element
        this.API.postResource(resource.name, { body: element })
        .then(() => {
          // sign the element as "successfully updated"
          element = null;
          doneEl();
        })
        .catch(() => {
          resource.error = true;
          doneEl();
        });
      }, () => {
        // keep the elements NOT successfully updated
        this.storage.set(OFFLINE_RESOURCE_KEY_PREFIX.concat(resource.name),
          resource.elementsToUpload.filter(x => x)
        )
        .then(() => {
          resource.synchronizing = false;
          if(resource.error) reject();
          else resolve();
        });
      });
    })
  }

  /**
   * Analize the resource by consulting its list as an index, then cache the latter.
   * Based on the `mAt` mechanism, identify the new/changed elements and cache them.
   * @todo old elements in cache aren't deleted (they just disappear from the index).
   */
  protected cacheResource(resource: CacheableResource): Promise<void> {
    return new Promise((resolve, reject) => {
      resource.synchronizing = true;
      resource.error = false;
      // get (online) the resource elements list and update its cache (index)
      this.API.getResource(resource.name, { useCache: CacheModes.NETWORK_FIRST })
      .then((cloudElements: Array<any>) => {
        // prepare the array of ids of the elements to cache
        let toCache = new Array<string>();
        // for each element check if the cache is up to date
        Async.each(cloudElements, (cloudEl: any, done: any) => {
          // get the localEl (from cache) and confront the mAt values with the cloudEl
          this.API.getResource(resource.name, { resourceId: cloudEl[resource.idAttribute],
            useCache: CacheModes.CACHE_ONLY
          })
          .then((localEl: any) => {
            // cloudEl more recent than localEl -> download cloudEl
            if(!localEl.mAt || cloudEl.mAt > localEl.mAt)
              toCache.push(localEl[resource.idAttribute]);
            done();
          })
          .catch(() => {
            // !localEl -> download cloudEl
            toCache.push(cloudEl[resource.idAttribute]);
            done();
          });
        }, () => {
          // cache the elements identified
          Async.eachSeries(toCache, (id: string, done: any) => {
            // note: the NETWORK_FIRST request will cache the response
            this.API.getResource(resource.name, { resourceId: id,
              useCache: CacheModes.NETWORK_FIRST
            })
            .then(() => done())
            .catch((err: Error) => done(err))
          }, (err: Error) => {
            resource.error = Boolean(err);
            resource.synchronizing = false;
            // in case of errors, we wouldn't know which element had failed: kill the entire process
            if(err) reject(err);
            else resolve();
          });
        })
      })
      .catch((err: Error) => {
        resource.error = true;
        resource.synchronizing = false;
        reject(err);
      });
    });
  }

  /**
   * Run general synchronization, only if needed, i.e. a resource needs to upload some elements or
   * the cached content expired.
   */
  public synchronizeIfNeeded(): void {
    if(
      this.offlineResources.some(x => x.elementsToUpload.length > 0) ||
      Date.now() > (this.lastSyncAt + SYNC_EXPIRATION_INTERVAL)
    ) this.synchronize();
  }
  /**
   * General synchronization of the whole set of resources (upload+download).
   */
  protected synchronize(): void {
    if(this.synchronizing) return;
    this.synchronizing = true;
    // try to upload the elements of all the offline resources
    Async.each(this.offlineResources, (resource: OfflineResource, done: any) => {
      this.uploadOfflineResource(resource)
      .then(() => done())
      .catch(() => {
        // show an error alert, but don't make the entire process to fail
        this.errorInLastSync = true;
        done();
      });
    }, () => {
      // download (if needed) an updated version of the cached elements for each resource
      Async.each(this.resourcesToCache, (resource: CacheableResource, done: any) => {
        this.cacheResource(resource)
        .then(() => done())
        .catch(() => {
          // show an error alert, but don't make the entire process to fail
          this.errorInLastSync = true;
          done();
        });
      }, () => {
        if(this.errorInLastSync) this.synchronizing = false;
        else {
          // all the resources are succesfully in sync; update the timestamp of last sync
          this.lastSyncAt = Date.now();
          this.storage.set(LAST_SYNC_KEY, this.lastSyncAt)
          .then(() => this.synchronizing = false);
        }
      });
    });
  }
}

/**
 * A resource of which the elements are allowed to be created offline (UPLOAD).
 */
export class OfflineResource {
  /**
   * The resource name.
   */
  public name: string;
  /**
   * The resource description.
   */
  public description: string;
  /**
   * The elements of the resource which are stored offline and needs to be uploaded.
   * **Each element is the body of a POST request.**
   */
  public elementsToUpload: Array<Object>;
  /**
   * Runtime attribute to know if the resource is synchronizing.
   */
  public synchronizing: boolean;
  /**
   * True if one of the elements failed to upload.
   */
  public error: boolean;

  constructor(name: string, description?: string) {
    this.name = name;
    this.description = description || this.name;
    this.elementsToUpload = new Array<Object>();
    this.synchronizing = false;
    this.error = false;
  }
}

/**
 * A resource to cache offline from the back-end (DOWNLOAD).
 */
export class CacheableResource {
  /**
   * The resource name.
   */
  public name: string;
  /**
   * The name of the attribute that works as resourceId.
   */
  public idAttribute: string;
  /**
   * The resource description.
   */
  public description: string;
  /**
   * Runtime attribute to know if the resource is synchronizing.
   */
  public synchronizing: boolean;
  /**
   * True if one of the elements failed to upload.
   */
  public error: boolean;

  constructor(name: string, idAttribute: string, description?: string) {
    this.name = name;
    this.idAttribute = idAttribute;
    this.description = description || name;
    this.synchronizing = false;
    this.error = false;
  }
}