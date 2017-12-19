import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';
import { IDEAAWSAPIService } from '../AWSAPI.service';

// from idea-config.js
declare const IDEA_APP_TITLE;
declare const IDEA_APP_WEBSITE;
declare const IDEA_APP_REGISTRATION_POSSIBLE;
declare const IDEA_SHOW_LOGO;

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
  //
  protected username: string;
  protected password: string;

  constructor(
    protected navCtrl: NavController,
    protected message: IDEAMessageService,
    protected loading: IDEALoadingService,
    protected auth: IDEAAuthService,
    protected API: IDEAAWSAPIService,
    protected t: TranslateService
  ) {
    this.title = IDEA_APP_TITLE;
    this.website = IDEA_APP_WEBSITE;
    this.registrationPossible = IDEA_APP_REGISTRATION_POSSIBLE;
    this.showIDEALogo = IDEA_SHOW_LOGO;
  }
  protected ionViewCanEnter(): Promise<void> { return this.API.initAndAuth(false); }

  public login(): void {
    this.loading.show();
    this.auth.login(this.username, this.password)
    .then(() => {
      this.loading.hide();
      window.location.assign('');
    })
    .catch((err) => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.AUTHENTICATION_FAILED'),
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
