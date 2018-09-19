import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Config, Events } from 'ionic-angular';
import { IDEAErrorReportingService } from './errorReporting.service';

// from idea-config.js
declare const IDEA_API_ID: string;
declare const IDEA_API_REGION: string;
declare const IDEA_API_VERSION: string;

const API_URL =
  `https://${IDEA_API_ID}.execute-api.${IDEA_API_REGION}.amazonaws.com/${IDEA_API_VERSION}`;

/**
 * To communicate with an AWS's API Gateway istance.
 *
 * Includes a rundimental cache on GET requests, until Android doesn't support SWs on local files.
 *
 * Note: requires an `AWSAPIAuthToken` variable to be set by Ionic Config.
 */
@Injectable()
export class IDEAAWSAPIService {
  constructor(
    protected http: HttpClient,
    protected ionConfig: Config,
    protected storage: Storage,
    protected events: Events,
    protected errorReporting: IDEAErrorReportingService
  ) {}

  /**
   * Execute an online API request.
   * @param resource resource name (e.g. `users`)
   * @param method enum HTTP methods
   * @param options the request options
   */
  protected request(resource: string, method: string, options?: APIRequestOption): Promise<any> {
    return new Promise((resolve, reject) => {
      const opt = options || <APIRequestOption>{};
      // prepare a single resource request (by id) or a normal one
      const url = API_URL.concat(`/${resource}/`).concat(opt.resourceId || '');
      // preare the headers and set the Authorization; note: HttpHeaders is immutable!
      let headers = new HttpHeaders(opt.headers || null);
      if(!headers.get('Authorization') && this.ionConfig.get('AWSAPIAuthToken'))
        headers = headers.append('Authorization', this.ionConfig.get('AWSAPIAuthToken'));
      // execute the request
      let req;
      let searchParams = new HttpParams();
      switch(method) {
        case 'HEAD': req = this.http.head(url, { headers: headers }); break;
        case 'POST': req = this.http.post(url, opt.body, { headers: headers }); break;
        case 'PUT': req = this.http.put(url, opt.body, { headers: headers }); break;
        case 'PATCH': req = this.http.patch(url, opt.body, { headers: headers }); break;
        case 'DELETE': req = this.http.delete(url, { headers: headers }); break;
        default: /* GET */ {
          // prepare the query params; note: HttpParams is immutable!
          if(opt.params)
            for(let prop in opt.params)
              searchParams = searchParams.set(prop, opt.params[prop]);
          req = this.http.get(url, { headers: headers, params: searchParams });
        }
      }
      // handle the request response
      req.subscribe(
        (res: any) => resolve(res),
        (err: HttpErrorResponse) => {
          if(opt.reportError) this.errorReporting.sendReport(err);
          this.fixErrMessageBeforeReject(err, reject);
        }
      );
    });
  }
  /**
   * Converts the error message to be readable.
   */
  protected fixErrMessageBeforeReject(err: HttpErrorResponse, reject: any): void {
    console.debug(err); // to see the original one
    let e;
    try {
      if(!err || !err.error) e = {};
      else if(typeof err.error == 'string') e = JSON.parse(err.error);
      else e = err.error;
    }
    catch(_) { e = {} };
    reject(new Error(e.message || 'Unknown error!'));
  }

  /**
   * Use the HttpClient to execute a raw request.
   */
  public rawRequest(): HttpClient {
    return this.http;
  }

  /**
   * HEAD request.
   * @param resource resource name (e.g. `users`)
   * @param options the request options
   */
  public headResource(resource: string, options?: APIRequestOption): Promise<any> {
    return this.request(resource, 'HEAD', options);
  }

  /**
   * GET request. Include options to cache the requests (`options.useCache`), to work also offline.
   *
   * If a a resource is updated in the background, e.g. `CACHE_FIRST`, throws an `AWSAPI:<resource>`
   * event that can be listened to update a component's UI accordingly.
   *
   * @param resource resource name (e.g. `users`)
   * @param options the request options
   */
  public getResource(resource: string, options?: APIRequestOption): Promise<any> {
    return new Promise((resolve, reject) => {
      // if offline and with a cache mode set, force the request to the cache
      if(!navigator.onLine && options.useCache) options.useCache = CacheModes.CACHE_ONLY;
      // execute the GET request online or through the cache, depending on the chosen mode
      switch(options.useCache) {
        case CacheModes.CACHE_ONLY:
          // return the result from the cache, without retrying online if a result wasn't found
          this.getFromCache(resource, options)
          .then((res: any) => resolve(res))
          .catch((err: Error) => reject(err));
        break;
        case CacheModes.CACHE_FIRST:
          // return the result from the cache
          this.getFromCache(resource, options)
          .then((res: any) => {
            resolve(res);
            // asynchrounously execute the request online, to update the cache with the latest data
            this.request(resource, 'GET', options)
            .then((res: any) => {
              // send an event to let everyone know that the resource was updated in the background
              this.events.publish(`AWSAPI:${resource}`, res);
              // update the cache (if it fails, it's ok)
              this.putInCache(resource, res, options)
              .then(() => {})
              .catch(() => {});
            })
            .catch((err: Error) => reject(err));
          })
          .catch(() => {
            // if the result isn't found in the cache, return the result of the online request
            this.request(resource, 'GET', options)
            .then((res: any) => {
              resolve(res);
              // update the cache (if it fails, it's ok)
              this.putInCache(resource, res, options)
              .then(() => {})
              .catch(() => {});
            })
            .catch((err: Error) => reject(err));
          });
        break;
        case CacheModes.NETWORK_FIRST:
          // return the result from an online request
          this.request(resource, 'GET', options)
          .then((res: any) => {
            resolve(res);
            // update the cache (if it fails, it's ok)
            this.putInCache(resource, res, options)
            .then(() => {})
            .catch(() => {});
          })
          // if a request to the network failed, it counts as an error (no fallback to cache);
          // if offline, we already followed the `CACHE_ONLY` flow
          .catch((err: Error) => reject(err));
        break;
        default: /* CacheModes.NO_CACHE */
          // return the result from an online request, with no cache involved
          this.request(resource, 'GET', options)
          .then((res: any) => resolve(res))
          .catch((err: Error) => reject(err));
      }
    });
  }
  /**
   * Execute a GET request from the local storage.
   * @param resource resource name (e.g. `users`)
   * @param options the request options
   */
  protected getFromCache(resource: string, options?: APIRequestOption): Promise<any> {
    return new Promise((resolve, reject) => {
      const opt = options || <APIRequestOption>{};
      // prepare a single resource request (by id) or a normal one
      const url = API_URL.concat(`/${resource}/`).concat(opt.resourceId || '');
      // prepare the query params; note: HttpParams is immutable!
      let searchParams = new HttpParams();
      if(opt.params)
        for(let prop in opt.params)
          searchParams = searchParams.set(prop, opt.params[prop]);
      // get from storage
      this.storage.get(url.concat(searchParams.toString()))
      .then((res: any) => res ? resolve(res): reject(new Error(`NOT_FOUND`)));
    });
  }
  /**
   * Execute a PUT request in the local storage.
   * @param resource resource name (e.g. `users`)
   * @param options the request options
   */
  protected putInCache(resource: string,  data: any, options?: APIRequestOption): Promise<any> {
    return new Promise((resolve, reject) => {
      const opt = options || <APIRequestOption>{};
      // prepare a single resource request (by id) or a normal one
      const url = API_URL.concat(`/${resource}/`).concat(opt.resourceId || '');
      // prepare the query params; note: HttpParams is immutable!
      let searchParams = new HttpParams();
      if(opt.params)
        for(let prop in opt.params)
          searchParams = searchParams.set(prop, opt.params[prop]);
      // put in the storage
      this.storage.set(url.concat(searchParams.toString()), data)
      .then(() => resolve())
      .catch(() => reject());
    });
  }

  /**
   * POST request.
   * @param resource resource name (e.g. `users`)
   * @param options the request options
   */
  public postResource(resource: string, options?: APIRequestOption): Promise<any> {
    return this.request(resource, 'POST', options);
  }

  /**
   * PUT request.
   * @param resource resource name (e.g. `users`)
   * @param options the request options
   */
  public putResource(resource: string, options?: APIRequestOption): Promise<any> {
    return this.request(resource, 'PUT', options);
  }

  /**
   * PATCH request.
   * @param resource resource name (e.g. `users`)
   * @param options the request options
   */
  public patchResource(resource: string, options?: APIRequestOption): Promise<any> {
    return this.request(resource, 'PATCH', options);
  }

  /**
   * DELETE request.
   * @param resource resource name (e.g. `users`)
   * @param options the request options
   */
  public deleteResource(resource: string, options?: APIRequestOption): Promise<any> {
    return this.request(resource, 'DELETE', options);
  }

  /**
   * Execute the code to initialize the app, try to authenticate and decide what to do afterwards.
   *
   * Act as a guard function for Ionic components (to call inside `ionViewCanEnter`).
   *
   * @param authNeeded when true, if the authentication fails, redirect to sign-in flow.
   * @return a promise; resolve => you can enter, reject => fallback to auth or else.
   */
  public initAndAuth: (authNeeded: boolean) => Promise<void>;
}

export class APIRequestOption {
  /**
  * To identify a specific resource by id.
  */
  public resourceId?: string;
  /**
  * The query parameters of the request.
  */
  public params?: any;
  /**
  * The body of the request.
  */
  public body?: any;
  /**
  * The additional headers of the request; `Authorization` is included by default.
  */
  public headers?: any;
  /**
  * Which mode to use to take advance of the requests caching mechanism.
  */
  public useCache?: CacheModes;
  /**
   * If true, report the errors that occurs during the request.
   */
  public reportError?: boolean;
}

/**
 * Set of usable cache modes.
 */
export enum CacheModes {
  /**
   * Return the result from an online request, with no cache involved.
   */
  NO_CACHE = 0,
  /**
   * Return the result from an online request, storing the result in the cache,
   * to update it with the latest data.
   */
  NETWORK_FIRST,
  /**
   * Return the result from the cache, but also execute the request online, to update the cache
   * with the latest data.
   * If the result isn't found in the cache, return the result of the online request.
   */
  CACHE_FIRST,
  /**
   * Return the result from the cache, without retrying online if a result wasn't found.
   */
  CACHE_ONLY
};
