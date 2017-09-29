import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from 'ionic-angular';

// from idea-config.js
declare const IDEA_API_ID;
declare const IDEA_API_VERSION;

const API_URL = `https://${IDEA_API_ID}.execute-api.eu-west-2.amazonaws.com/${IDEA_API_VERSION}`;

/**
 * To communicate with an AWS's API Gateway istance.
 * To be extended and istantiated; note: requires an AWSAPIAuthToken var to be set by Ionic Config
 */
@Injectable()
export class IDEAAWSAPIService {
  constructor(protected http: Http, protected ionConfig: Config) {}

  protected request(
    resource: string, method: string, body?: any,
    searchParams?: URLSearchParams, additionalHeaders?: Headers
  ) {
    let url = `${API_URL}/${resource}`;
    console.debug(method, url, body,
      searchParams ? searchParams.toString() : null, additionalHeaders);
    let headers = additionalHeaders || new Headers();
    if(!headers.get('Authorization')) // ovverride the default authorization
      headers.append('Authorization', this.ionConfig.get('AWSAPIAuthToken'));
    switch(method) {
      case 'HEAD': return this.http.head(url, { headers: headers }); // no body, no mapping
      case 'POST': return this.http.post(url, body, { headers: headers }).map(res => res.json());
      case 'PUT': return this.http.put(url, body, { headers: headers }).map(res => res.json());
      case 'PATCH': return this.http.patch(url, body, { headers: headers }).map(res => res.json());
      case 'DELETE': return this.http.delete(url, { headers: headers }).map(res => res.json());
      default: /* GET */ return this.http.get(url, { headers: headers, search: searchParams })
        .map(res => res.json());
    }
  }
  public rawRequest() {
    return this.http;
  }

  public headResource(resource: string, options?: APIRequestOption): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // get from the API
      this.request(req, 'HEAD')
      .subscribe(res => resolve(res), err => reject(err));
    });
  }
  public getResource(resource: string, options?: APIRequestOption): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    const params = options ? options.params : null;
    const additionalHeaders = options && options.headers ? new Headers(options.headers) : null;
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // optionally set search params
      let searchParams = new URLSearchParams();
      if(params) for(let prop in params) searchParams.set(prop, params[prop]);
      // try to get from the API
      this.request(req, 'GET', null, searchParams, additionalHeaders)
      .subscribe(res => resolve(res), err => reject(Error()));
    });
  }
  public postResource(resource: string, options?: APIRequestOption): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    const body = options ? options.body : null;
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // save in the API
      this.request(req, 'POST', body)
      .subscribe(res => resolve(res), err => reject(err));
    });
  }
  public putResource(resource: string, options?: APIRequestOption): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    const body = options ? options.body : null;
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // save in the API
      this.request(req, 'PUT', body)
      .subscribe(res => resolve(res), err => reject(err));
    });
  }
  public patchResource(resource: string, options?: APIRequestOption): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    const body = options ? options.body : null;
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // save in the API
      this.request(req, 'PATCH', body)
      .subscribe(res => resolve(res), err => reject(err));
    });
  }
  public deleteResource(resource: string, options?: APIRequestOption): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    const params = options ? options.params : null;
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // optionally set search params
      let searchParams = new URLSearchParams();
      if(params) for(let prop in params) searchParams.set(prop, params[prop]);
      // delete from the API
      this.request(req, 'DELETE', null, searchParams)
      .subscribe(() => resolve(), err => reject(err));
    });
  }
}

 export class APIRequestOption {
   public resourceId?: string;
   public params?: any;
   public body?: any;
   public headers?: any;
 }
