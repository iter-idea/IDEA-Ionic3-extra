import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEADateUtils } from './dateUtils.service';

@Component({
  selector: 'IDEADateTimeComponent',
  templateUrl: 'dateTime.component.html'
})
export class IDEADateTimeComponent {
  @Input() protected date: Date;
  @Input() protected timePicker: boolean;
  @Input() protected label: string;
  @Input() protected icon: string;
  @Input() protected placeholder: string;
  @Input() protected disabled: boolean;
  @Input() protected obligatory: boolean;
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
      refDate: this.date, title: this.label, timePicker: this.timePicker
    });
    modal.onDidDismiss(date => {
      if(date !== undefined && date !== null) {
        if(date == '') this.onDateSelected.emit(null);
        else this.onDateSelected.emit(date.getTime());
      }
    });
    modal.present();
  }

  /**
   * Calculate the value to show.
   */
  protected getValue(): string {
    return this.date ?
      this.timePicker ?
        this.d.dt2l(this.date, false, false, true) :
        this.d.d2l(this.date, false, false, true)
    : '';
  }
}
