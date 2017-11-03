import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEALanguagePickerComponent } from './languagePicker.component';

@NgModule({
  declarations: [
    IDEALanguagePickerComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEALanguagePickerComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEALanguagePickerComponent
  ]
})
export class IDEALanguagePickerComponentModule {}
