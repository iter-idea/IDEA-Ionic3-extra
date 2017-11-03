import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEARegistrationComponent } from './registration.component';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';

@NgModule({
  declarations: [
    IDEARegistrationComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEARegistrationComponent),
    TranslateModule.forChild()
  ],
  providers: [
    IDEAAuthService,
    IDEAMessageService,
    IDEALoadingService
  ]
})
export class IDEARegistrationComponentModule {}
