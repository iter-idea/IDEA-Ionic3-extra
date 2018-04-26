import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';
import { IDEAAWSAPIService } from '../AWSAPI.service';

// from idea-config.js
declare const IDEA_AUTH_VIDEO;

@IonicPage({
  name: 'sign-up',
  segment: 'sign-up',
  defaultHistory: ['sign-in']
})
@Component({
  selector: 'IDEAAuthComponent',
  templateUrl: 'registration.component.html'
})
export class IDEARegistrationComponent {
  protected showVideo: boolean;
  protected mode: string; // 'R' register, 'C' confirm registration, 'S' send again the code
  protected username: string;
  protected password: string;
  protected email: string;
  protected name: string;
  protected code: string;
  protected errorMsg: string;

  constructor(
    protected navCtrl: NavController,
    protected message: IDEAMessageService,
    protected loading: IDEALoadingService,
    protected auth: IDEAAuthService,
    protected API: IDEAAWSAPIService,
    protected t: TranslateService
  ) {
    this.showVideo = IDEA_AUTH_VIDEO;
    this.mode = 'R';
    this.username = '';
    this.password = '';
    this.email = '';
    this.name = '';
    this.code = '';
    this.errorMsg = '';
  }
  protected ionViewCanEnter(): Promise<void> { return this.API.initAndAuth(false); }

  public register(): void {
    this.errorMsg = '';
    // check the fields
    if(this.username.trim().length == 0)
      this.errorMsg = this.t.instant('IDEA.AUTH.USERNAME_OBLIGATORY');
    if(this.email.trim().length == 0)
      this.errorMsg = this.t.instant('IDEA.AUTH.EMAIL_OBLIGATORY');
    if(this.password.trim().length < 8)
      this.errorMsg = this.t.instant('IDEA.AUTH.PASSWORD_POLICY_VIOLATION', { n: 8 });
    // output the error, if there was one
    if(this.errorMsg.length > 0) {
      this.message.show(this.t.instant('IDEA.AUTH.REGISTRATION_FAILED'), this.message.TYPE_ERROR);
      return;
    }
    // start the registration
    this.loading.show();
    this.auth.register(this.username, this.password, { email: this.email, name: this.name.trim() })
    .then(user => {
      this.loading.hide();
      this.mode = 'C'; // confirm the account with the code
    })
    .catch(err => {
      this.loading.hide();
      this.errorMsg = err.message; // show the error detail on screen (english)
      this.message.show(this.t.instant('IDEA.AUTH.REGISTRATION_FAILED'),
        this.message.TYPE_ERROR);
    });
  }
  public confirmRegistration(): void {
    this.errorMsg = '';
    if(this.username.trim().length == 0)
      this.errorMsg = this.t.instant('IDEA.AUTH.USERNAME_OBLIGATORY');
    if(this.code.trim().length == 0)
      this.errorMsg = this.t.instant('IDEA.AUTH.CONFIRMATION_CODE_OBLIGATORY');
    // output the error, if there was one
    if(this.errorMsg.length > 0) {
      this.message.show(this.t.instant('IDEA.AUTH.SENDING_FAILED'), this.message.TYPE_ERROR);
      return;
    }
    this.loading.show();
    this.auth.confirmRegistration(this.username, this.code)
    .then(() => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.REGISTRATION_COMPLETED'), this.message.TYPE_SUCCESS);
      this.goToLogin();
    })
    .catch(err => {
      this.loading.hide();
      this.errorMsg = this.t.instant('IDEA.AUTH.CONFIRMATION_CODE_INVALID');
      this.message.show(this.t.instant('IDEA.AUTH.SENDING_FAILED'), this.message.TYPE_ERROR);
    });
  }
  public resendConfirmationCode(): void {
    this.errorMsg = '';
    if(this.username.trim().length == 0)
      this.errorMsg = this.t.instant('IDEA.AUTH.USERNAME_OBLIGATORY');
    // output the error, if there was one
    if(this.errorMsg.length > 0) {
      this.message.show(this.t.instant('IDEA.AUTH.SENDING_FAILED'), this.message.TYPE_ERROR);
      return;
    }
    this.loading.show();
    this.auth.resendConfirmationCode(this.username)
    .then(() => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.CONFIRMATION_CODE_SENT'),
        this.message.TYPE_SUCCESS);
      this.mode = 'C'; // confirm the account with the code
    })
    .catch(err => {
      this.loading.hide();
      this.errorMsg = this.t.instant('IDEA.AUTH.IS_THE_USERNAME_CORRECT');
      this.message.show(this.t.instant('IDEA.AUTH.SENDING_FAILED'), this.message.TYPE_ERROR);
    });
  }
  public goToLogin(): void {
    this.navCtrl.setRoot('sign-in');
  }
}
