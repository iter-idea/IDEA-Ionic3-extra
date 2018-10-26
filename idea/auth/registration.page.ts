import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';
import { IDEAAWSAPIService } from '../AWSAPI.service';

// from idea-config.js
declare const IDEA_AUTH_VIDEO: boolean;

@IonicPage({
  name: 'sign-up',
  segment: 'sign-up',
  defaultHistory: ['sign-in']
})
@Component({
  selector: 'IDEAAuthPage',
  templateUrl: 'registration.page.html'
})
export class IDEARegistrationPage {
  protected showVideo: boolean;
  /**
   * === email.
   */
  protected username: string;
  protected password: string;
  /**
   * 'R' registration, 'L' resend confirmation link.
   */
  protected mode: string;
  protected privacyPolicyCheck: boolean;
  protected errorMsg: string;

  constructor(
    protected platform: Platform,
    protected navCtrl: NavController,
    protected message: IDEAMessageService,
    protected loading: IDEALoadingService,
    protected auth: IDEAAuthService,
    protected API: IDEAAWSAPIService,
    protected t: TranslateService
  ) {
    this.showVideo = IDEA_AUTH_VIDEO;
    this.mode = 'R';
    this.privacyPolicyCheck = false;
  }
  protected ionViewCanEnter(): Promise<void> { return this.API.initAndAuth(false); }

  /**
   * Register the new user in cognito (note DynamoDB still need to be managed).
   */
  protected register(): void {
    this.errorMsg = null;
    // check the fields
    if(!(this.username || '').trim())
      this.errorMsg = this.t.instant('IDEA.AUTH.USERNAME_OBLIGATORY');
    if((this.password || '').trim().length < 8)
      this.errorMsg = this.t.instant('IDEA.AUTH.PASSWORD_POLICY_VIOLATION', { n: 8 });
    // output the error, if there was one
    if(this.errorMsg) {
      this.message.show(this.t.instant('IDEA.AUTH.REGISTRATION_FAILED'), this.message.TYPE_ERROR);
      return;
    }
    // start the registration
    this.loading.show();
    this.auth.register(this.username, this.password)
    .then(() => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.REGISTRATION_COMPLETED'), this.message.TYPE_SUCCESS);
      this.goToLogin();
    })
    .catch(err => {
      this.loading.hide();
      // show the unexpected error on screen (english)
      this.errorMsg = err.message;
      this.message.show(this.t.instant('IDEA.AUTH.REGISTRATION_FAILED'),
        this.message.TYPE_ERROR);
    });
  }

  /**
   * Resend the link to confirm the email address.
   */
  protected resendConfirmationLink(): void {
    this.errorMsg = null;
    if(!(this.username || '').trim().length)
      this.errorMsg = this.t.instant('IDEA.AUTH.USERNAME_OBLIGATORY');
    // output the error, if there was one
    if(this.errorMsg) {
      this.message.show(this.t.instant('IDEA.AUTH.SENDING_FAILED'), this.message.TYPE_ERROR);
      return;
    }
    this.loading.show();
    this.auth.resendConfirmationCode(this.username)
    .then(() => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.CONFIRMATION_LINK_SENT'),
        this.message.TYPE_SUCCESS);
      this.goToLogin();
    })
    .catch(() => {
      this.loading.hide();
      this.errorMsg = this.t.instant('IDEA.AUTH.IS_THE_USERNAME_CORRECT');
      this.message.show(this.t.instant('IDEA.AUTH.SENDING_FAILED'), this.message.TYPE_ERROR);
    });
  }

  /**
   * Go to sign-in page.
   */
  protected goToLogin(): void {
    this.navCtrl.setRoot('sign-in');
  }
}
