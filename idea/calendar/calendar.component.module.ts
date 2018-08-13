import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { IDEACalendarComponent } from './calendar.component';
import { IDEADatetimeComponent } from './datetime.component';
import { IDEADateUtils } from './dateUtils.service';

@NgModule({
  declarations: [
    IDEACalendarComponent,
    IDEADatetimeComponent
  ],
  imports: [
    IonicPageModule.forChild(IDEACalendarComponent),
    TranslateModule.forChild()
  ],
  entryComponents: [
    IDEACalendarComponent,
    IDEADatetimeComponent
  ],
  exports: [
    IDEACalendarComponent,
    IDEADatetimeComponent
  ],
  providers: [
    IDEADateUtils
  ]
})
export class IDEACalendarComponentModule {}
