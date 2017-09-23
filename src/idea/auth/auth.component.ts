import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';

import { IDEAForgotPwdComponent } from './forgotPwd.component';

// from idea-config.js
declare const IDEA_APP_TITLE;
declare const IDEA_APP_TAGLINE;
declare const IDEA_APP_WEBSITE;

@Component({
  selector: 'IDEAAuthComponent',
  templateUrl: 'auth.component.html'
})
export class IDEAAuthComponent {
  private username: string;
  private password: string;

  constructor(
    private navCtrl: NavController,
    private message: IDEAMessageService,
    private loading: IDEALoadingService,
    private auth: IDEAAuthService,
  ) {}

  public login(): void {
    this.loading.show();
    this.auth.login(this.username, this.password)
    .then(() => {
      this.loading.hide();
      window.location.reload(); // required
    })
    .catch((err) => {
      this.loading.hide();
      this.message.show('Authentication failed', this.message.TYPE_ERROR);
    });
  }
  public goToForgotPassword(): void {
    this.navCtrl.setRoot(IDEAForgotPwdComponent);
  }
}
