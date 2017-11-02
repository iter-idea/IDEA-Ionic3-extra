import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';

import { IDEAAuthComponent } from './auth.component';

@Component({
  selector: 'IDEARegistrationComponent',
  templateUrl: 'registration.component.html'
})
export class IDEARegistrationComponent {
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
    protected t: TranslateService
  ) {
    this.mode = 'R';
    this.username = '';
    this.password = '';
    this.email = '';
    this.name = '';
    this.code = '';
    this.errorMsg = '';
  }

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
    this.auth.register(this.username, this.password, {
      email: this.email, name: this.name.trim().length > 0 ? this.name : this.email
    })
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
      this.message.show(this.t.instant('IDEA.AUTH.CONFIRMATION_CODE_SENT'), this.message.TYPE_SUCCESS);
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
    this.navCtrl.setRoot(IDEAAuthComponent);
  }
}
