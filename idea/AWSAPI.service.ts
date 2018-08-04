import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Config } from 'ionic-angular';
import { IDEAErrorReportingService } from './errorReporting.service';

// from idea-config.js
declare const IDEA_API_ID: string;
declare const IDEA_API_REGION: string;
declare const IDEA_API_VERSION: string;

const API_URL =
  `https://${IDEA_API_ID}.execute-api.${IDEA_API_REGION}.amazonaws.com/${IDEA_API_VERSION}`;

/**
 * To communicate with an AWS's API Gateway istance.
 * To be extended and istantiated; note: requires an AWSAPIAuthToken var to be set by Ionic Config
 */
@Injectable()
export class IDEAAWSAPIService {
  constructor(
    protected http: HttpClient,
    protected ionConfig: Config,
    protected errorReporting: IDEAErrorReportingService
  ) {}

  protected request(
    resource: string, method: string, body?: any,
    searchParams?: HttpParams, additionalHeaders?: HttpHeaders, responseType?: any
  ) {
    let url = `${API_URL}/${resource}`;
    let headers = additionalHeaders || new HttpHeaders(); // note: HttpHeaders is immutable!
    if(!headers.get('Authorization') && this.ionConfig.get('AWSAPIAuthToken'))
      // ovverride the default authorization
      headers = headers.append('Authorization', this.ionConfig.get('AWSAPIAuthToken'));
    switch(method) {
      case 'HEAD': return this.http.head(url, { headers: headers }); // no body, no mapping
      case 'POST': return this.http.post(url, body, { headers: headers });
      case 'PUT': return this.http.put(url, body, { headers: headers });
      case 'PATCH': return this.http.patch(url, body, { headers: headers });
      case 'DELETE': return this.http.delete(url, { headers: headers });
      default: /* GET */ return this.http.get(url, {
        headers: headers, params: searchParams, responseType: responseType || 'json'
      });
    }
  }
  public rawRequest() {
    return this.http;
  }

  public headResource(
    resource: string, options?: APIRequestOption, reportError?: boolean
  ): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // get from the API
      this.request(req, 'HEAD')
      .subscribe(
        res => resolve(res),
        err => {
          if(reportError) this.errorReporting.sendReport(err);
          this.fixErrMessageBeforeReject(err, reject);
        }
      );
    });
  }
  public getResource(
    resource: string, options?: APIRequestOption, reportError?: boolean
  ): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    const params = options ? options.params : null;
    const additionalHeaders = options && options.headers ? new HttpHeaders(options.headers) : null;
    var responseType = 'json';
    if(additionalHeaders &&
      [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ].some(h => h == additionalHeaders.get('Accept'))
    )
      responseType = 'blob';
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // optionally set search params
      let searchParams = new HttpParams();
      if(params) for(let prop in params) searchParams = searchParams.set(prop, params[prop]);
      // try to get from the API
      this.request(req, 'GET', null, searchParams, additionalHeaders, responseType)
      .subscribe(
        res => resolve(res),
        err => {
          if(reportError) this.errorReporting.sendReport(err);
          this.fixErrMessageBeforeReject(err, reject);
        }
      );
    });
  }
  public postResource(
    resource: string, options?: APIRequestOption, reportError?: boolean
  ): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    const body = options ? options.body : null;
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // save in the API
      this.request(req, 'POST', body)
      .subscribe(
        res => resolve(res),
        err => {
          if(reportError) this.errorReporting.sendReport(err);
          this.fixErrMessageBeforeReject(err, reject);
        }
      );
    });
  }
  public putResource(
    resource: string, options?: APIRequestOption, reportError?: boolean
  ): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    const body = options ? options.body : null;
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // save in the API
      this.request(req, 'PUT', body)
      .subscribe(
        res => resolve(res),
        err => {
          if(reportError) this.errorReporting.sendReport(err);
          this.fixErrMessageBeforeReject(err, reject)
        });
    });
  }
  public patchResource(
    resource: string, options?: APIRequestOption, reportError?: boolean
  ): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    const body = options ? options.body : null;
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // save in the API
      this.request(req, 'PATCH', body)
      .subscribe(
        res => resolve(res),
        err => {
          if(reportError) this.errorReporting.sendReport(err);
          this.fixErrMessageBeforeReject(err, reject);
        }
      );
    });
  }
  public deleteResource(
    resource: string, options?: APIRequestOption, reportError?: boolean
  ): Promise<any> {
    // map the options
    const resourceId = options ? options.resourceId : null;
    const params = options ? options.params : null;
    return new Promise((resolve, reject) => {
      // prepare a single resource request (by id) o a normal one
      let req = resourceId ? `${resource}/${resourceId}` : resource;
      // optionally set search params
      let searchParams = new HttpParams();
      if(params) for(let prop in params) searchParams = searchParams.set(prop, params[prop]);
      // delete from the API
      this.request(req, 'DELETE', null, searchParams)
      .subscribe(
        () => resolve(),
        err => {
          if(reportError) this.errorReporting.sendReport(err);
          this.fixErrMessageBeforeReject(err, reject);
        }
      );
    });
  }
  /**
   * Converts the error message to be readable.
   */
  public fixErrMessageBeforeReject(err: HttpErrorResponse, rejectCB: any): void {
    console.debug(err); // to see the original one
    rejectCB(new Error(err && err.error ? err.error.message : 'Unknown error!' ));
  }
  /**
   * Execute the code to initialize the app, try to authenticate and decide what to do afterwards.
   * Act as a guard function for Ionic components (to call inside `ionViewCanEnter`).
   * @return a promise; resolve => you can enter, reject => fallback to auth or else.
   */
  public initAndAuth: (authNeeded: boolean) => Promise<void>;
}

 export class APIRequestOption {
   public resourceId?: string;
   public params?: any;
   public body?: any;
   public headers?: any;
 }
