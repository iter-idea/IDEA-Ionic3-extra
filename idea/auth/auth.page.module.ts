import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAAuthPage } from './auth.page';

@NgModule({
  declarations: [
    IDEAAuthPage
  ],
  imports: [
    IonicPageModule.forChild(IDEAAuthPage),
    TranslateModule.forChild()
  ]
})
export class IDEAAuthPageModule { }
