import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { MyApp } from './app.component';
import { TestComponent } from '../test.component';

import { IDEAMessageService } from '../idea/message.service';
import { IDEALoadingService } from '../idea/loading.service';

import { IDEACheckerComponent } from '../idea/checker/checker.component';
import { IDEACalendarComponent } from '../idea/calendar/calendar.component';
import { IDEADatetimeComponent } from '../idea/calendar/datetime.component';

import { IDEAAuthComponent } from '../idea/auth/auth.component';
import { IDEAForgotPwdComponent } from '../idea/auth/forgotPwd.component';
import { IDEARegistrationComponent } from '../idea/auth/registration.component';
import { IDEAAuthService } from '../idea/auth/auth.service';

import { IDEALanguagePickerComponent } from '../idea/languagePicker.component';

// the translate loader needs to know where to load i18n files in Ionic's static asset pipeline
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MyApp, TestComponent,
    IDEACheckerComponent,
    IDEACalendarComponent, IDEADatetimeComponent,
    IDEAAuthComponent, IDEAForgotPwdComponent, IDEARegistrationComponent,
    IDEALanguagePickerComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({ name: 'idea-ionic-extra' }),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    MyApp, TestComponent,
    IDEACheckerComponent,
    IDEACalendarComponent, IDEADatetimeComponent,
    IDEAAuthComponent, IDEAForgotPwdComponent, IDEARegistrationComponent,
    IDEALanguagePickerComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    IDEAMessageService,
    IDEALoadingService,
    IDEAAuthService
  ]
})
export class AppModule {}
