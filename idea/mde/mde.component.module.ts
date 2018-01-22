import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEAMarkdownEditorComponent } from './mde.component';

@NgModule({
  declarations: [
    IDEAMarkdownEditorComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEAMarkdownEditorComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEAMarkdownEditorComponent
  ],
  exports: [
    IDEAMarkdownEditorComponent
  ]
})
export class IDEAMarkdownEditorComponentModule {}
