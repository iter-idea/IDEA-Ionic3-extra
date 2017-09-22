import { Component } from "@angular/core";
import { ModalController } from 'ionic-angular';

import { IDEAMessageService } from './idea/message.service';
import { IDEALoadingService } from './idea/loading.service';

import { IDEACheckerComponent } from './idea/checker/checker.component';
import { IDEACalendarComponent } from './idea/calendar/calendar.component';
import { IDEADateTimeComponent } from './idea/calendar/dateTime.component';

@Component({
  template: `
    <ion-content padding>
      Hey there!
      <p>
        <idea-datetime [label]="'A date'" [labelType]="'stacked'" [date]="aDate"></idea-datetime>
      </p>
    </ion-content>
  `,
  entryComponents: [ IDEADateTimeComponent ]
})
export class TestComponent {
  private aDate: Date;

  constructor(
  // SERVICES
    private message: IDEAMessageService,
    private loading: IDEALoadingService,
  // HELPERS
    private modalCtrl: ModalController
  ) {
    this.aDate = new Date();
  }
  ionViewDidLoad() {
  // MESSAGE SERVICE
    this.message.show('Test message', this.message.TYPE_DEFAULT);
  // LOADING SERVICE
    this.loading.show();
    setTimeout(() => { this.loading.hide() }, 1000);
  // IDEACheckER COMPONENT
    let IDEAChecks = [
      { id: 'ITA', value: 'Italian', checked: false },
      { id: 'ENG', value: 'English', checked: true }
    ];
    this.modalCtrl
    .create(IDEACheckerComponent, { title: 'Languages', IDEAChecks: IDEAChecks })
    //.present();
  // IDEACalendar COMPONENT
    let modal = this.modalCtrl.create(IDEACalendarComponent, { refDate: new Date() });
    modal.onDidDismiss(date => { if(date) this.aDate = date });
    //modal.present();
  }
}
