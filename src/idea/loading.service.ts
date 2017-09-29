import { Injectable } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';

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
      content: content || this.t.instant('IDEA.LOADING.PLEASE_WAIT') });
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
