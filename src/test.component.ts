import { Component } from "@angular/core";
import { ModalController } from 'ionic-angular';

import { IDEAMessageService } from './idea/message.service';
import { IDEALoadingService } from './idea/loading.service';

import { IDEACheckerComponent } from './idea/checker/checker.component';
import { IDEACalendarComponent } from './idea/calendar/calendar.component';
import { IDEADatetimeComponent } from './idea/calendar/datetime.component';

@Component({
  template: `
    <ion-content padding>
      Hey there!
      <p>
        <idea-datetime [label]="'A date'" [labelType]="'stacked'" [date]="aDate"></idea-datetime>
      </p>
    </ion-content>
  `,
  entryComponents: [ IDEADatetimeComponent ]
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
    let checks = [
      { id: 'UKR', value: 'Ukrianian', checked: true, hidden: false },
      { id: 'ITA', value: 'Italian', checked: false, hidden: false },
      { id: 'ENG', value: 'English', checked: true, hidden: false },
      { id: 'ESP', value: 'Spanish', checked: false, hidden: true },
      { id: 'FRA', value: 'French', checked: false, hidden: true },
      { id: 'GER', value: 'German', checked: false, hidden: false }
    ];
    this.modalCtrl
    .create(IDEACheckerComponent, { title: 'Languages', checks: checks })
    //.present();
  // IDEACalendar COMPONENT
    let modal = this.modalCtrl.create(IDEACalendarComponent, { refDate: new Date() });
    modal.onDidDismiss(date => { if(date) this.aDate = date });
    //modal.present();
  }
}
