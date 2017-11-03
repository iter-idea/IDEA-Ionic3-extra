import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEACheckerComponent } from './checker.component';

@NgModule({
  declarations: [
    IDEACheckerComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEACheckerComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEACheckerComponent
  ]
})
export class IDEACheckerComponentModule {}
