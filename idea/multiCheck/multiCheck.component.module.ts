import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAMultiCheckComponent } from './multiCheck.component';
import { IDEAMultiCheckerComponent } from './multiChecker.component';

@NgModule({
  declarations: [
    IDEAMultiCheckComponent,
    IDEAMultiCheckerComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEAMultiCheckComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEAMultiCheckComponent,
    IDEAMultiCheckerComponent
  ],
  exports: [
    IDEAMultiCheckComponent,
    IDEAMultiCheckerComponent
  ]
})
export class IDEAMultiCheckComponentModule {}
