import { Injectable } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class IDEALoadingService {
  private l: Loading;

  constructor(private loadingCtrl: LoadingController, private t: TranslateService) {}

  /**
   * Show a loading animation.
   * @param content loading message
   */
  public show(content?: string): void {
    this.l = this.loadingCtrl.create({
      content: content === null || content === undefined
        ? this.t.instant('IDEA.LOADING.PLEASE_WAIT') : content });
    this.l.present();
  }
  /**
   * Hide a previous loading animation.
   */
  public hide(): void {
    this.l.dismiss();
    this.l = null;
  }
}
