import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';
import { IDEAAWSAPIService } from '../AWSAPI.service';

@IonicPage({
  name: 'forgot-password',
  segment: 'forgot-password',
  defaultHistory: ['sign-in']
})
@Component({
  selector: 'IDEAAuthComponent',
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
    protected API: IDEAAWSAPIService,
    protected t: TranslateService
  ) {
    this.mode = 'R';
  }
  protected ionViewCanEnter(): Promise<void> { return this.API.initAndAuth(false); }

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
      this.navCtrl.setRoot('sign-in');
    })
    .catch(() => {
      this.loading.hide();
      this.message.show(this.t.instant('IDEA.AUTH.CONFIRM_PASSWORD_ERROR'),
         this.message.TYPE_ERROR);
    });
  }
  public goToLogin(): void {
    this.navCtrl.setRoot('sign-in');
  }
}
