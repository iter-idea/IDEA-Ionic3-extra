import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAForgotPwdComponent } from './forgotPwd.component';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';

@NgModule({
  declarations: [
    IDEAForgotPwdComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEAForgotPwdComponent),
    TranslateModule.forChild()
  ],
  providers: [
    IDEAAuthService,
    IDEAMessageService,
    IDEALoadingService
  ]
})
export class IDEAForgotPwdComponentModule { }
