import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEADateUtils } from './dateUtils.service';

@Component({
  selector: 'idea-datetime',
  template: `
    <ion-item
      [attr.tappable]="disabled ? null : true"
      [class.selectable]="!disabled"
    >
      <ion-label
        stacked
        *ngIf="labelType=='stacked'"
      >
        {{ label }}
      </ion-label>
      <ion-label
        fixed
        *ngIf="labelType=='fixed'"
      >
        {{ label }}
      </ion-label>
      <ion-label
        floating
        *ngIf="labelType=='floating'"
      >
        {{ label }}
      </ion-label>
      <ion-label
        inset
        *ngIf="labelType=='inset'"
      >
        {{ label }}
      </ion-label>
      <ion-input
        readonly
        type="text"
        [value]="date ? d.d2l(date, false, false, true) : null"
        [disabled]="disabled"
        (click)="openCalendarPicker()"
      >
      </ion-input>
      <button
        ion-button item-end clear
        *ngIf="!disabled"
        (click)="onDateSelected.emit(null)"
      >
        {{ 'IDEA.CALENDAR.RESET' | translate }}
      </button>
    </ion-item>
  `,
  styles:[
    `.selectable input { cursor: pointer }`
  ]
})
export class IDEADatetimeComponent {
  @Input() protected label: string;
  @Input() protected labelType: string;
  @Input() protected date: Date;
  @Input() protected format: string;
  @Input() protected toolbarBgColor: string;
  @Input() protected toolbarColor: string;
  @Input() protected disabled: boolean;
  @Output() protected onDateSelected = new EventEmitter<number>();

  constructor(
    protected modalCtrl: ModalController,
    protected d: IDEADateUtils,
    protected t: TranslateService
  ) {}

  /**
   * Open the calendar picker to select a date.
   */
  protected openCalendarPicker(): void {
    if(this.disabled) return;
    let modal = this.modalCtrl.create('idea-calendar', {
      refDate: this.date, title: this.label,
      toolbarBgColor: this.toolbarBgColor, toolbarColor: this.toolbarColor
    });
    modal.onDidDismiss(date => {
      if(date) this.onDateSelected.emit(date.getTime());
    });
    modal.present();
  }
}
