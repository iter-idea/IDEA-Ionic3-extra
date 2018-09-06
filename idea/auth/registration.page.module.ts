import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEARegistrationPage } from './registration.page';

@NgModule({
  declarations: [
    IDEARegistrationPage
  ],
  imports: [
    IonicPageModule.forChild(IDEARegistrationPage),
    TranslateModule.forChild()
  ]
})
export class IDEARegistrationPageModule {}
