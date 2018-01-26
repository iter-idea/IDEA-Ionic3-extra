import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEARegistrationComponent } from './registration.component';

@NgModule({
  declarations: [
    IDEARegistrationComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEARegistrationComponent),
    TranslateModule.forChild()
  ]
})
export class IDEARegistrationComponentModule {}
