import { Injectable } from '@angular/core';

// from JS libs in index.html
declare var AWS: any;
declare var AWSCognito: any;
// from aws-config.js
declare const aws_project_region;
declare const aws_user_pools_id;
declare const aws_user_pools_web_client_id;

@Injectable()
export class Cognito {
  constructor() {
    if(AWSCognito) {
      AWSCognito.config.region = aws_project_region;
      AWSCognito.config.credentials = AWS.config.credentials;
      AWSCognito.config.update({ customUserAgent: AWS.config.customUserAgent });
    }
  }
  public getUserPool() {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool({
      'UserPoolId': aws_user_pools_id,
      'ClientId': aws_user_pools_web_client_id
    });
  }
  public getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }
  public makeAuthDetails(username, password) {
    return new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
      'Username': username,
      'Password': password
    });
  }
  public makeAttribute(name, value) {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
      'Name': name,
      'Value': value
    });
  }
  public makeUser(username) {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
      'Username': username,
      'Pool': this.getUserPool()
    });
  }
  public getUserDetails(accessToken) {
    return new Promise((resolve, reject) => {
      new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18', region: aws_project_region
      }).getUser({ AccessToken: accessToken }, (err, user) => {
        if(err) reject(err);
        else {
          let attributes = [];
          user.UserAttributes.forEach(a => attributes[a.Name] = a.Value);
          resolve(attributes);
        }
      });
    });
  }
}
