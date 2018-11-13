import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEADateUtils } from './dateUtils.service';

@Component({
  selector: 'IDEADateTimeComponent',
  templateUrl: 'dateTime.component.html'
})
export class IDEADateTimeComponent {
  @Input() protected label: string;
  @Input() protected date: Date;
  @Input() protected timePicker: boolean;
  @Input() protected placeholder: string;
  @Input() protected toolbarBgColor: string;
  @Input() protected toolbarColor: string;
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
      refDate: this.date, title: this.label, timePicker: this.timePicker,
      toolbarBgColor: this.toolbarBgColor, toolbarColor: this.toolbarColor
    });
    modal.onDidDismiss(date => {
      if(date !== undefined && date !== null) {
        if(date == '') this.onDateSelected.emit(null);
        else this.onDateSelected.emit(date.getTime());
      }
    });
    modal.present();
  }
}
