import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAAuthComponent } from './auth.component';

@NgModule({
  declarations: [
    IDEAAuthComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEAAuthComponent),
    TranslateModule.forChild()
  ]
})
export class IDEAAuthComponentModule { }
