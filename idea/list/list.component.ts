import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { IDEAAWSAPIService } from '../AWSAPI.service';

@Component({
  selector: 'IDEAListComponent',
  templateUrl: 'list.component.html'
})
export class IDEAListComponent {
  protected list: Array<any>;
  protected title: string;
  protected authNeeded: boolean;
  protected toolbarColor: string;

  constructor(
    protected viewCtrl: ViewController,
    protected navParams: NavParams,
    protected alertCtrl: AlertController,
    protected API: IDEAAWSAPIService,
    protected t: TranslateService,
  ) {
    this.list = this.navParams.get('list').slice() || [];
    this.title = this.navParams.get('title') || this.t.instant('IDEA.LIST.LIST');
    this.authNeeded = this.navParams.get('authNeeded') !== false;
    this.toolbarColor = this.navParams.get('toolbarColor') || 'dark';
  }
  protected ionViewCanEnter(): Promise<void> { return this.API.initAndAuth(this.authNeeded); }

  protected addElement(): void {
    this.alertCtrl.create({
      title: this.t.instant('IDEA.LIST.NEW_ELEMENT'),
      inputs: [ { name: 'element', placeholder: this.t.instant('IDEA.LIST.ELEMENT') } ],
      buttons: [
        { text: this.t.instant('COMMON.CANCEL'), handler: () => {} },
        {
          text: this.t.instant('COMMON.SAVE'),
          handler: data => {
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
  protected removeElement(element: any) {
    var index = -1;
    this.list.forEach(i => { if(element === i) index = this.list.indexOf(element) });
    if(index >= 0) this.list.splice(index, 1);
  }

  protected close(save?: boolean): void {
    this.viewCtrl.dismiss(save ? this.list : null);
  }
}
