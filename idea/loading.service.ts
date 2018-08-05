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
    if(this.l) this.hide(); // clean possible errors
    this.l = this.loadingCtrl.create({
      content: content === null || content === undefined
        ? this.t.instant('IDEA.LOADING.PLEASE_WAIT') : content });
    this.l.present();
  }
  /**
   * Change the content of the loading animation, while it's already on.
   * @param content new loading message
   */
  public setContent(content: string): void {
    if(this.l) this.l.setContent(content);
  }
  /**
   * Hide a previous loading animation.
   */
  public hide(): void {
    if(this.l) this.l.dismiss();
    this.l = null;
  }
}
