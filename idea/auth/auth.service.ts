import { Injectable } from '@angular/core';

import { Cognito } from './cognito.service';

@Injectable()
export class IDEAAuthService {
  private cognito: Cognito;

  constructor() {
    this.cognito = new Cognito();
  }

  public getUsername(): any {
    return this.cognito.getCurrentUser().getUsername();
  }
  public login(username: string, password: string): Promise<any> {
    // note: the email is an alias of the username
    return new Promise((resolve, reject) => {
      // find the user and its authentication details...
      let user = this.cognito.makeUser(username);
      let authDetails = this.cognito.makeAuthDetails(username, password);
      // ... to perform a login
      user.authenticateUser(authDetails, {
        onSuccess: () => { resolve() },
        onFailure: (err) => { reject(err) },
        newPasswordRequired: () => {
          // confirm the temporary password
          user.completeNewPasswordChallenge(password, {}, {
            onSuccess: () => { resolve() },
            onFailure: (err) => { reject(err) }
          });
        }
      });
    });
  }
  public register(username: string, password: string, attributes: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // add attributes like the email address and the fullname
      let attributeList = [];
      for(let prop in attributes)
        attributeList.push(this.cognito.makeAttribute(prop, attributes[prop]))
      // register the new user
      this.cognito.getUserPool().signUp(username, password, attributeList, null, (err, res) => {
        if(err) reject(err);
        else resolve(res.user);
      });
    });
  }
  public confirmRegistration(username: string, code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // find the user
      let user = this.cognito.makeUser(username);
      // confirm the registration of the user with the code provided
      user.confirmRegistration(code, true, (err, res) => {
        if(err) reject(err);
        else resolve();
      });
    });
  }
  public resendConfirmationCode(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // find the user
      let user = this.cognito.makeUser(username);
      // resend the confirmation code
      user.resendConfirmationCode((err, res) => {
        if(err) reject(err);
        else resolve();
      });
    });
  }
  public logout(): void {
    this.isAuthenticated()
    .then(() => {
      this.cognito.getCurrentUser().signOut();
      window.location.assign('');
    })
    .catch(() => { window.location.assign('') });
  }
  public forgotPassword(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // find the user and request a password reset
      this.cognito.makeUser(email)
      .forgotPassword({
        onSuccess: () => { resolve() },
        onFailure: (err) => { reject(err) }
      });
    });
  }
  public confirmPassword(email: string, code: string, newPassword: string): Promise<any> {
     return new Promise((resolve, reject) => {
      // get the user and confirm a new password
      this.cognito.makeUser(email)
      .confirmPassword(code, newPassword, {
        onSuccess: () => { resolve() },
        onFailure: (err) => { reject(err) }
      });
    });
  }
  public isAuthenticated(offlineCountsAsLogged?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      // offlineCountsAsLogged -> to avoid auth checks if online
      if(offlineCountsAsLogged && !navigator.onLine) resolve();
      let user = this.cognito.getCurrentUser();
      if(user != null) {
        user.getSession((err, session) => {
          if(err) reject(err);
          else {
            // get user attributes
            this.cognito.getUserDetails(session.getAccessToken().getJwtToken())
            .then(userDetails => resolve({
              accessToken: session.getIdToken().getJwtToken(), userDetails: userDetails
            }))
            .catch(err => reject(err));
          }
        });
      } else reject();
    });
  }
}
