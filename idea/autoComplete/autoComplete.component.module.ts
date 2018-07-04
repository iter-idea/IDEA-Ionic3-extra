import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAAutoCompleteComponent } from './autoComplete.component';

import { IDEABoldPrefix } from './boldPrefix.pipe';

@NgModule({
  declarations: [
    IDEAAutoCompleteComponent,
    IDEABoldPrefix
  ],
  imports: [
    IonicPageModule.forChild(IDEAAutoCompleteComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEAAutoCompleteComponent
  ],
  exports: [
    IDEAAutoCompleteComponent,
    IDEABoldPrefix
  ]
})
export class IDEAAutoCompleteComponentModule {}
