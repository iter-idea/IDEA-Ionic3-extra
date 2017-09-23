import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { TestComponent } from '../test.component';

import { IDEAMessageService } from '../idea/message.service';
import { IDEALoadingService } from '../idea/loading.service';

import { IDEACheckerComponent } from '../idea/checker/checker.component';
import { IDEACalendarComponent } from '../idea/calendar/calendar.component';
import { IDEADatetimeComponent } from '../idea/calendar/datetime.component';

@NgModule({
  declarations: [
    MyApp, TestComponent,
    IDEACheckerComponent,
    IDEACalendarComponent, IDEADatetimeComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    MyApp, TestComponent,
    IDEACheckerComponent,
    IDEACalendarComponent, IDEADatetimeComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    IDEAMessageService,
    IDEALoadingService
  ]
})
export class AppModule {}
