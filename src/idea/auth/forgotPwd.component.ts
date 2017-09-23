import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';

import { IDEAAuthComponent } from './auth.component';

@Component({
  selector: 'IDEAForgotPwdComponent',
  templateUrl: 'forgotPwd.component.html'
})
export class IDEAForgotPwdComponent {
  private mode: string; // 'R' recover, 'C' confirm
  private email: string;
  private code: string;
  private newPassword: string;

  constructor(
    private navCtrl: NavController,
    private message: IDEAMessageService,
    private loading: IDEALoadingService,
    private auth: IDEAAuthService
  ) {
    this.mode = 'R';
  }

  public forgotPassword(): void {
    this.loading.show();
    this.auth.forgotPassword(this.email)
    .then(result => {
      this.loading.hide();
      this.message.show(`The code to reset the password has been sent via email`);
      this.mode = 'C';
    })
    .catch(() => {
      this.loading.hide();
      this.message.show('User not found', this.message.TYPE_ERROR);
    });
  }
  public confirmPassword(): void {
    this.loading.show();
    this.auth.confirmPassword(this.email, this.code, this.newPassword)
    .then(result => {
      this.loading.hide();
      this.message.show('Password changed! Now you can sign in again', this.message.TYPE_SUCCESS);
      this.navCtrl.setRoot(IDEAAuthComponent);
    })
    .catch(() => {
      this.loading.hide();
      this.message.show('User not found, code not correct or password too easy',
         this.message.TYPE_ERROR);
    });
  }
  public goToLogin(): void {
    this.navCtrl.setRoot(IDEAAuthComponent);
  }
}
