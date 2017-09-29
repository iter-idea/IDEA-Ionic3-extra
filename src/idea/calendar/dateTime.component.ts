import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { IDEACalendarComponent } from './calendar.component'

@Component({
  selector: 'idea-datetime',
  template: `
  <ion-item>
    <ion-label
      [attr.stacked]="labelType=='stacked' ? true : null"
      [attr.fixed]="labelType=='fixed' ? true : null"
    >{{ label }}</ion-label>
    <ion-input
      value="{{ date | date }}" type="text" readonly tappable (click)="openCalendarPicker()"
    ></ion-input>
    <button ion-button item-end clear (click)="date=null">
      {{ 'IDEA.CALENDAR.RESET' | translate }}
    </button>
  </ion-item>
  `,
  styles: [
    `ion-item { border-bottom: none !important; }`,
    `.label[stacked] { margin-top: 0 !important; }`
  ]
})
/**
 * Note: two modes; contributor (single, userView); administrator (multiple views)
 */
export class IDEADatetimeComponent {
  @Input() label: String;
  @Input() labelType: String;
  @Input() date: Date;

  constructor(private modalCtrl: ModalController, private t: TranslateService) {}

  public openCalendarPicker(event: any): void {
    let modal = this.modalCtrl.create(IDEACalendarComponent, { refDate: this.date });
    modal.onDidDismiss(date => { if(date) this.date = date });
    modal.present();
  }
}
