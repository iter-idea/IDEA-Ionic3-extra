import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { TestComponent } from '../components/test.component';

import { IDEAMessageService } from '../services/ideaMessage.service';
import { IDEALoadingService } from '../services/ideaLoading.service';

import { IDEACheckerComponent } from '../components/IDEAChecker/IDEAChecker.component';
import { IDEACalendarComponent } from '../components/IDEACalendar/IDEACalendar.component';
import { IDEADateTimeComponent } from '../components/IDEACalendar/IDEADateTime.component';

@NgModule({
  declarations: [
    MyApp, TestComponent,
    IDEACheckerComponent,
    IDEACalendarComponent, IDEADateTimeComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    MyApp, TestComponent,
    IDEACheckerComponent,
    IDEACalendarComponent, IDEADateTimeComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    IDEAMessageService,
    IDEALoadingService
  ]
})
export class AppModule {}
