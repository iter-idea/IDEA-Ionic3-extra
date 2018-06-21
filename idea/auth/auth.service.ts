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
        onSuccess: () => { resolve(false) },
        onFailure: (err) => { reject(err) },
        newPasswordRequired: () => { resolve(true) }
      });
    });
  }
  public confirmNewPassword(
    username: string, tempPassword: string, newPassword: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // find the user and its temporary authentication details
      let user = this.cognito.makeUser(username);
      let authDetails = this.cognito.makeAuthDetails(username, tempPassword);
      // login with the old password
      user.authenticateUser(authDetails, {
        onSuccess: () => { resolve() },
        onFailure: (err) => { reject(err) },
        newPasswordRequired: () => {
          // complete the new password challenge
          user.completeNewPasswordChallenge(newPassword, {}, {
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
  public logout(dontReload?: boolean): void {
    this.isAuthenticated(false)
    .then(() => {
      this.cognito.getCurrentUser().signOut();
      if(!dontReload) window.location.assign('');
    })
    .catch(() => window.location.assign(''));
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
  public isAuthenticated(
    offlineCountsAsLogged: boolean, getFreshIdTokenOnExpiration?: (freshIdToken) => void
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // offlineCountsAsLogged -> to avoid auth checks if online
      if(offlineCountsAsLogged && !navigator.onLine) return resolve();
      var user = this.cognito.getCurrentUser();
      if(user != null) {
        user.getSession((err, session) => {
          if(err) reject(err);
          else {
            // get user attributes
            this.cognito.getUserDetails(session.getAccessToken().getJwtToken())
            .then(userDetails => {
              // set a timer to manage the autorefresh of the idToken (through the refreshToken)
              setTimeout(() => {
                this.refreshSession(user, session.refreshToken, getFreshIdTokenOnExpiration);
              }, 15*60*1000); // every 15 minutes
              // return the idToken (to use with API)
              resolve({
                idToken: session.getIdToken().getJwtToken(), userDetails: userDetails
              });
            })
            .catch(err => reject(err));
          }
        });
      } else reject();
    });
  }
  protected refreshSession(user: any, refreshToken: string, callback:(freshIdToken) => void): void {
    user.refreshSession(refreshToken, (err, session) => {
      if(err)
        setTimeout(() => {
          this.refreshSession(user, refreshToken, callback);
        }, 1*60*1000); // try again in 1 minute
      else {
        setTimeout(() => {
          this.refreshSession(user, session.refreshToken, callback);
        }, 15*60*1000); // every 15 minutes
        console.debug('Token refreshed');
        callback(session.getIdToken().getJwtToken());
      }
    });
  }
  public updateUserAttributes(attributes: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // prepare the attributes we want to change
      let attributeList = [];
      for(let prop in attributes)
        attributeList.push(this.cognito.makeAttribute(prop, attributes[prop]));
      let user = this.cognito.getCurrentUser();
      if(!user) reject();
      else user.getSession((err, session) => { // we need to get the session before to make changes
        if(err) reject(err);
        else user.updateAttributes(attributeList, (err, res) => {
          if(err) reject(err);
          else resolve();
        });
      });
    });
  }
}

