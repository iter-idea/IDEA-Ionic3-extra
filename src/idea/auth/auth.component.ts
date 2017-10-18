import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';

import { IDEAForgotPwdComponent } from './forgotPwd.component';
import { IDEARegistrationComponent } from './registration.component';

// from idea-config.js
declare const IDEA_APP_TITLE;
declare const IDEA_APP_WEBSITE;
declare const IDEA_APP_REGISTRATION_POSSIBLE;
declare const IDEA_SHOW_LOGO;

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
    protected t: TranslateService
  ) {
    this.title = IDEA_APP_TITLE;
    this.website = IDEA_APP_WEBSITE;
    this.registrationPossible = IDEA_APP_REGISTRATION_POSSIBLE;
    this.showIDEALogo = IDEA_SHOW_LOGO;
  }

  public login(): void {
    this.loading.show();
    this.auth.login(this.username, this.password)
    .then(() => {
      this.loading.hide();
      window.location.reload(); // required
    })
    .catch((err) => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.AUTHENTICATION_FAILED'),
        this.message.TYPE_ERROR);
    });
  }
  public goToRegistration(): void {
    this.navCtrl.setRoot(IDEARegistrationComponent);
  }
  public goToForgotPassword(): void {
    this.navCtrl.setRoot(IDEAForgotPwdComponent);
  }
}
