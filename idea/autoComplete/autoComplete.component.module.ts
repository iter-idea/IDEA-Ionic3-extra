import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAAutoCompleteComponent } from './autoComplete.component';
import { IDEASuggestionsComponent } from './suggestions.component';
import { IDEABoldPrefix } from './boldPrefix.pipe';

@NgModule({
  declarations: [
    IDEAAutoCompleteComponent,
    IDEASuggestionsComponent,
    IDEABoldPrefix
  ],
  imports: [
    IonicPageModule.forChild(IDEAAutoCompleteComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEAAutoCompleteComponent,
    IDEASuggestionsComponent
  ],
  exports: [
    IDEAAutoCompleteComponent,
    IDEASuggestionsComponent,
    IDEABoldPrefix
  ]
})
export class IDEAAutoCompleteComponentModule {}
