import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAAuthComponent } from './auth.component';

import { IDEAAuthService } from './auth.service';
import { IDEAMessageService } from '../message.service';
import { IDEALoadingService } from '../loading.service';

@NgModule({
  declarations: [
    IDEAAuthComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEAAuthComponent),
    TranslateModule.forChild()
  ],
  providers: [
    IDEAAuthService,
    IDEAMessageService,
    IDEALoadingService
  ]
})
export class IDEAAuthComponentModule { }
