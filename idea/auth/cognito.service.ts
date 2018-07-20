import { Injectable } from '@angular/core';

// from JS libs in index.html
declare var AWS: any;
declare var AWSCognito: any;
// from idea-config.js
declare const IDEA_AWS_COGNITO_REGION: string;
declare const IDEA_AWS_COGNITO_USER_POOL_ID: string;
declare const IDEA_AWS_COGNITO_WEB_CLIENT_ID: string;

@Injectable()
export class Cognito {
  constructor() {
    if(AWSCognito) {
      AWSCognito.config.region = IDEA_AWS_COGNITO_REGION;
      AWSCognito.config.credentials = AWS.config.credentials;
      AWSCognito.config.update({ customUserAgent: AWS.config.customUserAgent });
    }
  }
  public getUserPool() {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool({
      'UserPoolId': IDEA_AWS_COGNITO_USER_POOL_ID,
      'ClientId': IDEA_AWS_COGNITO_WEB_CLIENT_ID
    });
  }
  public getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }
  public makeAuthDetails(username: string, password: string) {
    return new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
      'Username': username,
      'Password': password
    });
  }
  public makeAttribute(name: string, value: any) {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
      'Name': name,
      'Value': value
    });
  }
  public makeUser(username: string) {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
      'Username': username,
      'Pool': this.getUserPool()
    });
  }
  public getUserDetails(accessToken: string) {
    return new Promise((resolve, reject) => {
      new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18', region: IDEA_AWS_COGNITO_REGION
      }).getUser({ AccessToken: accessToken }, (err: any, user: any) => {
        if(err) reject(err);
        else {
          let attributes = Array<any>();
          user.UserAttributes.forEach((a: any) => attributes[a.Name] = a.Value);
          resolve(attributes);
        }
      });
    });
  }
}
