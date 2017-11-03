import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class IDEAMessageService {
  public TYPE_DEFAULT: number = 0;
  public TYPE_SUCCESS: number = 1;
  public TYPE_WARNING: number = 2;
  public TYPE_ERROR: number = 3;

  constructor(private toastCtrl: ToastController) {}

  /**
   * Show a message toast.
   * @param message message to show
   * @param type 0 default | 1 success | 2 warning | 3 error
   */
  public show(message: string, type?: number): void {
    let bgColor: string;
    switch(type) {
      case this.TYPE_SUCCESS: bgColor = '#4caf50'; break;
      case this.TYPE_WARNING: bgColor = '#FF5722'; break;
      case this.TYPE_ERROR: bgColor = '#F44336'; break;
      default: bgColor = '#2e2e2e';
    }
    this.toastCtrl.create({ message: message,
      duration: 3000, position: 'bottom', showCloseButton: true,
      closeButtonText: 'X', cssClass: 'aVeryUnlikelyNameForAClass'
    })
    .present();
    // apply the style; the only (savage) way I've found to avoid external css
    setTimeout(() => {
      // weird code to avoid error if the timeout comes too soon and the elements don't exist yet;
      // on the other hand, by setting the timeout later the user risk to see the color change
      let toasts = document.getElementsByClassName('aVeryUnlikelyNameForAClass')
      if(toasts && toasts[0]) {
        let wrappers = toasts[0].getElementsByClassName('toast-wrapper');
        if(wrappers && wrappers[0])
          wrappers[0].setAttribute('style', 'background-color: '+bgColor);
      }
    }, 10);
  }
}
