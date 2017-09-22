import { Injectable } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';

@Injectable()
export class IDEALoadingService {
  private l: Loading;

  constructor(private loadingCtrl: LoadingController) {}

  /**
   * Show a loading animation.
   * @param content loading message
   */
  public show(content?: string): void {
    this.l = this.loadingCtrl.create({ content: content || 'Please wait...' });
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
