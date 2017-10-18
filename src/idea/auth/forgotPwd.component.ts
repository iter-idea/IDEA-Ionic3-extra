import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';

import { IDEAAuthComponent } from './auth.component';

@Component({
  selector: 'IDEAForgotPwdComponent',
  templateUrl: 'forgotPwd.component.html'
})
export class IDEAForgotPwdComponent {
  protected mode: string; // 'R' recover, 'C' confirm
  protected username: string;
  protected code: string;
  protected newPassword: string;

  constructor(
    protected navCtrl: NavController,
    protected message: IDEAMessageService,
    protected loading: IDEALoadingService,
    protected auth: IDEAAuthService,
    protected t: TranslateService
  ) {
    this.mode = 'R';
  }

  public forgotPassword(): void {
    this.loading.show();
    this.auth.forgotPassword(this.username)
    .then(result => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.PASSWORD_RESET_CODE_SENT'),
        this.message.TYPE_SUCCESS);
      this.mode = 'C';
    })
    .catch(() => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.USER_NOT_FOUND'),
        this.message.TYPE_ERROR);
    });
  }
  public confirmPassword(): void {
    this.loading.show();
    this.auth.confirmPassword(this.username, this.code, this.newPassword)
    .then(result => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.PASSWORD_CHANGED'),
        this.message.TYPE_SUCCESS);
      this.navCtrl.setRoot(IDEAAuthComponent);
    })
    .catch(() => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.CONFIRM_PASSWORD_ERROR'),
         this.message.TYPE_ERROR);
    });
  }
  public goToLogin(): void {
    this.navCtrl.setRoot(IDEAAuthComponent);
  }
}
