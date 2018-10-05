import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAOfflineManagerComponent } from './offlineManager.component';
import { IDEAOfflineBarComponent } from './offlineBar.component';

@NgModule({
  declarations: [
    IDEAOfflineManagerComponent,
    IDEAOfflineBarComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEAOfflineManagerComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEAOfflineManagerComponent,
    IDEAOfflineBarComponent
  ],
  exports: [
    IDEAOfflineManagerComponent,
    IDEAOfflineBarComponent
  ]
})
export class IDEAOfflineManagerComponentModule {}
