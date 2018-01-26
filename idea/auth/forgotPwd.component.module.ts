import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAForgotPwdComponent } from './forgotPwd.component';

@NgModule({
  declarations: [
    IDEAForgotPwdComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEAForgotPwdComponent),
    TranslateModule.forChild()
  ]
})
export class IDEAForgotPwdComponentModule { }
