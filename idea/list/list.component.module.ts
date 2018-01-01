import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAListComponent } from './list.component';

@NgModule({
  declarations: [
    IDEAListComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEAListComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEAListComponent
  ],
  exports: [
    IDEAListComponent
  ]
})
export class IDEAListComponentModule {}
