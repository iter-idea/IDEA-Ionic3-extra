import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'idea-datetime',
  template: `
  <ion-item class="ideaDateTimeItem">
    <ion-label *ngIf="labelType=='stacked'" stacked>{{ label }}</ion-label>
    <ion-label *ngIf="labelType=='fixed'" fixed>{{ label }}</ion-label>
    <ion-label *ngIf="labelType=='floating'" floating>{{ label }}</ion-label>
    <ion-label *ngIf="labelType=='inset'" inset>{{ label }}</ion-label>
    <ion-input
      value="{{ date | date:format }}" type="text" readonly tappable 
      (click)="openCalendarPicker()"
    ></ion-input>
    <button ion-button item-end clear (click)="onDateSelected.emit(null)">
      {{ 'IDEA.CALENDAR.RESET' | translate }}
    </button>
  </ion-item>
  `,
  styles: [
    `.ideaDateTimeItem { border-bottom: none !important; }`
  ]
})
export class IDEADatetimeComponent {
  @Input() protected label: string;
  @Input() protected labelType: string;
  @Input() protected date: Date;
  @Input() protected format: string;
  @Input() protected toolbarBgColor: string;
  @Input() protected toolbarColor: string;
  @Output() public onDateSelected = new EventEmitter<String>();

  constructor(protected modalCtrl: ModalController, protected t: TranslateService) {}

  public openCalendarPicker(): void {
    let modal = this.modalCtrl.create('idea-calendar', {
      refDate: this.date, title: this.label,
      toolbarBgColor: this.toolbarBgColor, toolbarColor: this.toolbarColor
    });
    modal.onDidDismiss(date => { 
      if(date) {
        // get rid of the timezone
        date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
        // return the date picked
        this.onDateSelected.emit(date); 
      }
    }); 
    modal.present();
  }
}
