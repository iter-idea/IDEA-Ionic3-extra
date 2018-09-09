import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEACalendarComponent } from './calendar.component';
import { IDEADateTimeComponent } from './dateTime.component';
import { IDEADateUtils } from './dateUtils.service';

@NgModule({
  declarations: [
    IDEACalendarComponent,
    IDEADateTimeComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEACalendarComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEACalendarComponent,
    IDEADateTimeComponent
  ],
  exports: [
    IDEACalendarComponent,
    IDEADateTimeComponent
  ],
  providers: [
    IDEADateUtils
  ]
})
export class IDEACalendarComponentModule {}
