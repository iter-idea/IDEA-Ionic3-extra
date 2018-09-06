import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAForgotPwdPage } from './forgotPwd.page';

@NgModule({
  declarations: [
    IDEAForgotPwdPage
  ],
  imports: [
    IonicPageModule.forChild(IDEAForgotPwdPage),
    TranslateModule.forChild()
  ]
})
export class IDEAForgotPwdPageModule { }
