import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class IDEADateUtils {
  constructor(protected t: TranslateService) {}

  /**
   * Convert the date to a locale string, based on the current language.
   * @param {Date | string | number} date the date to convet
   * @param {boolean} short if true, return a shorter version of the date
   * @param {boolean} noYear if true, hide the year
   * @returns {string} the string representation (in locale format)
   */
  public d2l(
    date: Date | string | number, short?: boolean, noYear?: boolean, noDayName?: boolean
  ): string {
    date = (date instanceof Date) ? date : new Date(date);
    let dayName = date.toLocaleDateString(this.t.currentLang,
      { weekday: short ? 'short' : 'long' });
    dayName = dayName.slice(0, 1).toUpperCase().concat(dayName.slice(1));
    let day = date.toLocaleDateString(this.t.currentLang, { day: 'numeric' });
    let month = date.toLocaleDateString(this.t.currentLang, { month: short ? 'short' : 'long' });
    month = month.slice(0, 1).toUpperCase().concat(month.slice(1));
    let year = date.toLocaleDateString(this.t.currentLang, { year: 'numeric' });
    return `${noDayName ? '' : dayName} ${day} ${month} ${noYear ? '' : year}`;
  }

  /**
   * Convert a time to a locale string, based on the current language.
   * @param {Date | string | number} date the date(time) to convert; the date part will be ignored
   * @returns {string} the string representation (in locale format)
   */
  public t2l(date: Date | number | string): string {
    date = (date instanceof Date) ? date : new Date(date);
    return date.toLocaleTimeString(this.t.currentLang, { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Extract the month and convert it to a locale string, based on the current language.
   * @param {Date | string | number} date the date to convet
   * @param {boolean} short if true, return a shorter version of the date
   * @returns {string} the string representation (in locale format)
   */
  public d2lm(date: Date | number | string, short?: boolean): string {
    date = (date instanceof Date) ? date : new Date(date);
    let month = date.toLocaleDateString(this.t.currentLang, { month: short ? 'short' : 'long' });
    return month.slice(0, 1).toUpperCase().concat(month.slice(1));
  }

  /**
   * Calculate the difference in days between the two dates.
   * Consider only the date part (no time).
   * @param {Date | string | number} d1
   * @param {Date | string | number} d2 if not set, today (now)
   * @returns {number} days of difference (0 == same day)
   */
  public dayDiff(d1: Date | number | string, d2?: Date | number | string): number {
    if(!d1) return null;
    d2 = d2 || new Date(); // today
    d1 = (d1 instanceof Date) ? d1 : new Date(d1);
    d2 = (d2 instanceof Date) ? d2 : new Date(d2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
  }

  /**
   * Return true if the two dates correspond to the same day.
   * Consider only the date part (no time).
   * @param {Date | string | number} d1
   * @param {Date | string | number} d2 if not set, today (now)
   * @returns {boolean}
   */
  public isSameDay(d1: Date | number | string, d2?: Date | number | string): boolean {
    return this.dayDiff(d1, d2) == 0;
  }
}
