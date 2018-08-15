import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEASignatureComponent } from './signature.component';

@NgModule({
  declarations: [
    IDEASignatureComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEASignatureComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEASignatureComponent
  ],
  exports: [
    IDEASignatureComponent
  ]
})
export class IDEASignatureComponentModule {}
