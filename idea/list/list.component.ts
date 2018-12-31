import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'IDEAListComponent',
  templateUrl: 'list.component.html'
})
export class IDEAListComponent {
  protected list: Array<any>;
  protected title: string;

  constructor(
    protected viewCtrl: ViewController,
    protected navParams: NavParams,
    protected alertCtrl: AlertController,
    protected t: TranslateService,
  ) {
    this.list = this.navParams.get('list') ? Array.from(this.navParams.get('list')) : []; // copy
    this.title = this.navParams.get('title') || this.t.instant('IDEA.LIST.LIST');
  }

  /**
   * Add a new element to the list.
   */
  protected addElement(): void {
    this.alertCtrl.create({
      title: this.t.instant('IDEA.LIST.NEW_ELEMENT'),
      inputs: [ { name: 'element', placeholder: this.t.instant('IDEA.LIST.ELEMENT') } ],
      buttons: [
        { text: this.t.instant('COMMON.CANCEL'), handler: () => {} },
        { text: this.t.instant('COMMON.SAVE'), handler: data => {
            if(data.element && data.element.trim().length) {
              this.list.push(data.element);
              this.list = this.list.sort();
            }
          }
        }
      ]
    })
    .present()
    .then(() => {
      const firstInput: any = document.querySelector('ion-alert input');
      firstInput.focus();
      return;
    });
  }
  /**
   * Remove the selected element from the list.
   */
  protected removeElement(element: any): void {
    this.list.splice(this.list.indexOf(element), 1);
  }

  /**
   * Close and save or simply dismiss.
   */
  protected close(save?: boolean): void {
    this.viewCtrl.dismiss(save ? this.list : null);
  }
}
