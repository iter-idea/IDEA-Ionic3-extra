import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEAOfflineService } from './offline.service';
import { IDEADateUtils } from '../calendar/dateUtils.service';

@Component({
  selector: 'IDEAOfflineManagerComponent',
  templateUrl: 'offlineManager.component.html'
})
export class IDEAOfflineManagerComponent {

  constructor(
    protected viewCtrl: ViewController,
    protected offline: IDEAOfflineService,
    protected d: IDEADateUtils,
    protected t: TranslateService
  ) {}

  /**
   * Smarter labeling based on a recent syncronization.
   */
  protected getLastSyncLabel(): string {
    const reasonableTime: number = 1000 * 60 * 5; // 5 minutes
    if(Date.now() < (this.offline.lastSyncAt + reasonableTime))
      return this.t.instant('IDEA.OFFLINE.NOW');
    else return this.d.dt2l(this.offline.lastSyncAt, false, true, true);
  }

  /**
   * Close the component.
   */
  protected close(): void {
    this.viewCtrl.dismiss();
  }
}