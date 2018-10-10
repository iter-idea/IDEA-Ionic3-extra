import { Component } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEAOfflineService, APIRequest } from './offline.service';
import { IDEADateUtils } from '../calendar/dateUtils.service';

@Component({
  selector: 'IDEAOfflineManagerComponent',
  templateUrl: 'offlineManager.component.html'
})
export class IDEAOfflineManagerComponent {

  constructor(
    protected viewCtrl: ViewController,
    protected alertCtrl: AlertController,
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
   * Prompt for deletion of a erroneous request (stuck).
   */
  protected deleteRequest(request: APIRequest): void {
    this.alertCtrl.create({
      title: this.t.instant('COMMON.ARE_YOU_SURE'),
      message: this.t.instant('IDEA.OFFLINE.DELETION_IS_IRREVERSIBLE'),
      buttons: [
        { text: this.t.instant('COMMON.CANCEL') },
        {
          text: this.t.instant('COMMON.CONFIRM'),
          handler: () => { this.offline.deleteRequest(request); }
        }
      ]
    })
    .present();
  }

  /**
   * Close the component.
   */
  protected close(): void {
    this.viewCtrl.dismiss();
  }
}