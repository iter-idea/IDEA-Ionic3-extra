import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';
import { IDEAAWSAPIService } from '../AWSAPI.service';

// from idea-config.js
declare const IDEA_APP_TITLE: string;
declare const IDEA_APP_WEBSITE: string;
declare const IDEA_AUTH_REGISTRATION_POSSIBLE: boolean;
declare const IDEA_AUTH_SHOW_LOGO: boolean;
declare const IDEA_AUTH_VIDEO: boolean;
declare const IDEA_WEBSITE: string;

@IonicPage({
  name: 'sign-in',
  segment: 'sign-in'
})
@Component({
  selector: 'IDEAAuthPage',
  templateUrl: 'auth.page.html'
})
export class IDEAAuthPage {
  protected title: string;
  protected website: string;
  protected registrationPossible: boolean;
  protected showIDEALogo: boolean;
  protected showVideo: boolean;
  protected IDEAWebsite: string;
  protected extraInfo: string; // to show dev important info
  //
  protected mode: string; // 'L' login, 'P' new password challenge
  protected username: string;
  protected password: string;
  protected newPassword: string;
  protected privacyPolicyCheck: boolean;

  constructor(
    protected platform: Platform,
    protected navCtrl: NavController,
    protected message: IDEAMessageService,
    protected loading: IDEALoadingService,
    protected auth: IDEAAuthService,
    protected API: IDEAAWSAPIService,
    protected t: TranslateService
  ) {
    this.title = IDEA_APP_TITLE;
    this.website = IDEA_APP_WEBSITE;
    this.registrationPossible = IDEA_AUTH_REGISTRATION_POSSIBLE;
    this.showIDEALogo = IDEA_AUTH_SHOW_LOGO;
    this.showVideo = IDEA_AUTH_VIDEO;
    this.IDEAWebsite = IDEA_WEBSITE;
    this.extraInfo = null;
    this.mode = 'L';
    this.privacyPolicyCheck = true;
  }
  protected ionViewCanEnter(): Promise<void> { return this.API.initAndAuth(false); }

  /**
   * Sign-in with the auth details provided.
   */
  public login(): void {
    this.loading.show();
    setTimeout(() => {
      // the timeout is needed to avoid a freeze time without no loading screen
      this.auth.login(this.username, this.password)
      .then(needNewPassword => {
        if(needNewPassword) {
          this.loading.hide();
          this.mode = 'P'; // go to new password challenge
        }
        else window.location.assign('');
      })
      .catch(() => {
        this.loading.hide();
        this.message.show(this.t.instant('IDEA.AUTH.AUTHENTICATION_FAILED'),
          this.message.TYPE_ERROR);
      });
    }, 100);
  }
  /**
   * Confirm a new password (auth flow that follows a registration or a password reset).
   */
  public confirmNewPassword(): void {
    this.loading.show();
    this.auth
    .confirmNewPassword(this.username, this.password, this.newPassword)
    .then(() => window.location.assign(''))
    .catch(() => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.PASSWORD_POLICY_VIOLATION', { n: 8 }),
        this.message.TYPE_ERROR);
    });
  }
  /**
   * Go to the registration page.
   */
  public goToRegistration(): void {
    this.navCtrl.setRoot('sign-up');
  }
  /**
   * Go to the forgot password page.
   */
  public goToForgotPassword(): void {
    this.navCtrl.setRoot('forgot-password');
  }
}
