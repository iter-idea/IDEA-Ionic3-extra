import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAOfflineBarComponent } from './offlineBar.component';

@NgModule({
  declarations: [
    IDEAOfflineBarComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEAOfflineBarComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEAOfflineBarComponent
  ],
  exports: [
    IDEAOfflineBarComponent
  ]
})
export class IDEAOfflineBarComponentModule {}
