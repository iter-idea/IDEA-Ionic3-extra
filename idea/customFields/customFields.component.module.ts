import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEACustomFieldsComponent } from './customFields.component';
import { IDEACustomFieldManagerComponent } from './customFieldManager.component';

@NgModule({
  declarations: [
    IDEACustomFieldsComponent,
    IDEACustomFieldManagerComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEACustomFieldsComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEACustomFieldsComponent,
    IDEACustomFieldManagerComponent
  ],
  exports: [
    IDEACustomFieldsComponent,
    IDEACustomFieldManagerComponent
  ]
})
export class IDEACustomFieldsComponentModule {}
