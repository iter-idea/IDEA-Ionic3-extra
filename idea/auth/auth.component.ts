import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';
import { IDEAAWSAPIService } from '../AWSAPI.service';

// from idea-config.js
declare const IDEA_APP_TITLE;
declare const IDEA_APP_WEBSITE;
declare const IDEA_AUTH_REGISTRATION_POSSIBLE;
declare const IDEA_AUTH_SHOW_LOGO;
declare const IDEA_AUTH_VIDEO;
declare const IDEA_WEBSITE;

@IonicPage({
  name: 'sign-in',
  segment: 'sign-in'
})
@Component({
  selector: 'IDEAAuthComponent',
  templateUrl: 'auth.component.html'
})
export class IDEAAuthComponent {
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

  public login(): void {
    this.loading.show();
    this.auth.login(this.username, this.password)
    .then(needNewPassword => {
      this.loading.hide();
      if(needNewPassword) this.mode = 'P'; // go to new password challenge
      else window.location.assign('');
    })
    .catch((err) => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.AUTHENTICATION_FAILED'),
        this.message.TYPE_ERROR);
    });
  }
  public confirmNewPassword(): void {
    this.loading.show();
    this.auth.confirmNewPassword(this.username, this.password, this.newPassword)
    .then(() => {
      this.loading.hide();
      window.location.assign('');
    })
    .catch((err) => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.PASSWORD_POLICY_VIOLATION', { n: 8 }),
        this.message.TYPE_ERROR);
    });
  }
  public goToRegistration(): void {
    this.navCtrl.setRoot('sign-up');
  }
  public goToForgotPassword(): void {
    this.navCtrl.setRoot('forgot-password');
  }
}
