import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEAAWSAPIService } from '../AWSAPI.service';
import { IDEADateUtils } from './dateUtils.service';

@IonicPage({
  name: 'idea-calendar'
})
@Component({
  selector: 'IDEACalendarComponent',
  templateUrl: 'calendar.component.html'
})
export class IDEACalendarComponent {
  protected selectedDate: Date;
  protected refDate: Date; // date used to center the calendar on the right month
  protected timePicker: boolean;
  protected title: string;

  // support
  protected calendarGrid: Array<Array<Date>>;
  protected hour: number;
  protected minute: number;
  protected hours: Array<string>;
  protected minutes: Array<string>;

  constructor(
    protected viewCtrl: ViewController,
    protected navParams: NavParams,
    protected alertCtrl: AlertController,
    protected d: IDEADateUtils,
    protected API: IDEAAWSAPIService,
    protected t: TranslateService
  ) {
    this.selectedDate = new Date(this.navParams.get('refDate') || new Date());
    this.title = this.navParams.get('title');
    this.timePicker = this.navParams.get('timePicker');

    this.refDate = new Date(this.selectedDate);
    if(this.timePicker) {
      this.hour = this.selectedDate.getHours();
      // round the minutes a multiple of 5
      this.minute = Math.ceil(this.selectedDate.getMinutes()/5)*5;
      this.selectedDate.setMinutes(this.minute);
    }
    this.buildCalendarGrid(this.refDate);
    this.hours = Array.from(Array(24).keys()).map(i => ('0'.concat(i.toString())).slice(-2));
    this.minutes = Array.from(Array(12).keys()).map(i => ('0'.concat((i*5).toString())).slice(-2));
  }
  protected ionViewCanEnter(): Promise<void> { return this.API.initAndAuth(false); }

  /**
   * Build the calendar grid based on the month of the *refDate*.
   * 6 rows and 7 columns (the days, from Monday to Sunday).
   */
  protected buildCalendarGrid(refDate: Date): void {
    // find the first day in the month: the important data here is the day of the week
    let firstDateOfMonth = new Date();
    firstDateOfMonth.setDate(1);
    firstDateOfMonth.setMonth(refDate.getMonth());
    firstDateOfMonth.setFullYear(refDate.getFullYear());
    // the following flag is used to divide the logic so I can fill the calendar
    // also with the dates from the previous month, until there's space in the grid
    let haventFoundFirstDay = true;
    // index used to build the dates of the month, starting from the first one
    let index = 1;
    this.calendarGrid = new Array<Array<Date>>();
    for(let i=0; i<6; i++) {
      this.calendarGrid[i] = new Array<Date>();
      for(let j=0; j<7; j++) {
        if(haventFoundFirstDay) {
          if(this.getWDay(firstDateOfMonth) == j) { // note: considers Sunday
            haventFoundFirstDay = false;
            this.calendarGrid[i][j] = firstDateOfMonth;
            // now the I've found the first date of the month I can fill the calendar
            // the dates fromt the previous month, until there's space in the grid
            for(let y=this.getWDay(firstDateOfMonth); y>=0; y--) {
              this.calendarGrid[i][this.getWDay(firstDateOfMonth)-y] =
                this.addDaysToDate(firstDateOfMonth, -y);
            }
          }
          // fill the following dates until there's space in the grid
        } else this.calendarGrid[i][j] = this.addDaysToDate(firstDateOfMonth, index++);
      }
    }
  }
  private getWDay(date: Date, fromSunday?: boolean): number {
    if(fromSunday) return date.getDay();
    else return (date.getDay() || 7) - 1;
  }
  private addDaysToDate(date: Date, days: number): Date {
    return new Date(date.getTime() + 86400000 * days); // ms in a day
  }

  /**
   * +- num years to the current one.
   */
  protected addYears(offset: number): void {
    this.refDate.setFullYear(this.refDate.getFullYear() + offset);
    this.buildCalendarGrid(this.refDate);
    this.refDate = new Date(this.refDate);  // to fire the "onChange" event
  }
  /**
   * Manual selection of the year.
   */
  public setYear(ev: any): void {
    let year = parseInt(ev.value);
    if(!year) return;
    this.refDate.setFullYear(year);
    this.buildCalendarGrid(this.refDate);
    this.refDate = new Date(this.refDate);  // to fire the "onChange" event
  }
  /**
   * +- num months to the current one.
   */
  protected addMonths(offset: number): void {
    this.refDate.setMonth(this.refDate.getMonth() + offset);
    this.buildCalendarGrid(this.refDate);
    this.refDate = new Date(this.refDate); // to fire the "onChange" event
  }
  /**
   * Manual selection of the month.
   */
  public showMonths(): void {
    let alert = this.alertCtrl.create();
    alert.setTitle(this.t.instant('IDEA.CALENDAR.MONTH'));
    let month = new Date(`1970-01-01`);
    for(let i = 1; i <= 12; i++) {
      alert.addInput({
        type: 'radio', label: this.d.d2lm(month), value: i.toString(),
        checked: (i == this.refDate.getMonth()+1)
      });
      month.setMonth(month.getMonth()+1);
    }
    alert.addButton(this.t.instant('COMMON.CANCEL'));
    alert.addButton({ text: this.t.instant('COMMON.SELECT'), handler: month => {
      this.refDate.setMonth(parseInt(month)-1);
      this.buildCalendarGrid(this.refDate);
      this.refDate = new Date(this.refDate);  // to fire the "onChange" event
    }});
    alert.present();
  }

  /**
   * Set the new date.
   */
  protected selectDate(date: Date): void {
    this.selectedDate.setDate(date.getDate());
    this.selectedDate.setMonth(date.getMonth());
    this.selectedDate.setFullYear(date.getFullYear());
  }

  /**
   * Set the new hour.
   */
  protected selectHour(hour: string): void {
    this.selectedDate.setHours(parseInt(hour));
  }
  /**
   * Set the new minute.
   */
  protected selectMinute(minute: string): void {
    this.selectedDate.setMinutes(parseInt(minute));
  }

  /**
   * Return true if the hour in the UI is the selected one.
   */
  protected isSameHour(hour: string): boolean {
    return this.selectedDate.getHours() == parseInt(hour);
  }
  /**
   * Return true if the minute in the UI is the selected one.
   */
  protected isSameMinute(minute: string): boolean {
    return this.selectedDate.getMinutes() == parseInt(minute);
  }

  /**
   * Confirm and close.
   */
  protected save(reset?: boolean): void {
    this.viewCtrl.dismiss(reset ? '' : this.selectedDate);
  }
}
