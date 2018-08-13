import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonicPage, NavParams, ViewController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEAAWSAPIService } from '../AWSAPI.service';
import { IDEADateUtils } from './dateUtils.service';

@IonicPage({
  name: 'idea-calendar'
})
@Component({
  selector: 'IDEACalendarComponent',
  templateUrl: 'calendar.component.html',
  providers: [ DatePipe ]
})
export class IDEACalendarComponent {
  protected selectedDate: Date;
  protected refDate: Date; // date used to center the calendar on the right month
  protected today: Date;
  protected calendarGrid: Array<Array<Date>>;
  protected title: string;
  protected toolbarBgColor: string;
  protected toolbarColor: string;

  constructor(
    protected viewCtrl: ViewController,
    protected navParams: NavParams,
    protected datePipe: DatePipe,
    protected alertCtrl: AlertController,
    protected d: IDEADateUtils,
    protected API: IDEAAWSAPIService,
    protected t: TranslateService
  ) {
    this.today = new Date();
    this.selectedDate = new Date(this.navParams.get('refDate') || this.today);
    this.refDate = new Date(this.selectedDate);
    this.title = this.navParams.get('title');
    this.toolbarBgColor = this.navParams.get('toolbarBgColor');
    this.toolbarColor = this.navParams.get('toolbaColor');
    this.buildCalendarGrid(this.refDate);
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
  public showYears(): void {
    let alert = this.alertCtrl.create();
    alert.setTitle(this.t.instant('IDEA.CALENDAR.YEAR'));
    for(let i = 1970; i < 2040; i++) alert.addInput({
      type: 'radio', label: i.toString(), value: i.toString(),
      checked: (i == this.refDate.getFullYear()+1)
    });
    alert.addButton(this.t.instant('COMMON.CANCEL'));
    alert.addButton({ text: this.t.instant('COMMON.SELECT'), handler: year => {
      this.refDate.setFullYear(year);
      this.buildCalendarGrid(this.refDate);
      this.refDate = new Date(this.refDate);  // to fire the "onChange" event
    }});
    alert.present();
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
    for(let i = 1; i <= 12; i++) alert.addInput({
      type: 'radio', label: this.d.d2lm(`1970-${i}`), value: i.toString(),
      checked: (i == this.refDate.getMonth()+1)
    });
    alert.addButton(this.t.instant('COMMON.CANCEL'));
    alert.addButton({ text: this.t.instant('COMMON.SELECT'), handler: month => {
      this.refDate.setMonth(parseInt(month)-1);
      this.buildCalendarGrid(this.refDate);
      this.refDate = new Date(this.refDate);  // to fire the "onChange" event
    }});
    alert.present();
  }

  /**
   * Select a date and close the calendar.
   */
  protected selectDate(date: Date): void {
    this.viewCtrl.dismiss(date);
  }
}
