import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { IDEAAWSAPIService } from '../AWSAPI.service';

// requires two assets folders:
//   1. flags, containing the pngs of each country's flags
//   2. i18n, containing the json of each country's translation

@Component({
  selector: 'IDEALanguagePickerComponent',
  templateUrl: 'languagePicker.component.html'
})
export class IDEALanguagePickerComponent {
  protected languages: Array<string>;

  constructor(
    protected t: TranslateService,
    protected storage: Storage,
    protected alertCtrl: AlertController,
    protected API: IDEAAWSAPIService
  ) {
    this.languages = t.getLangs();
  }
  protected ionViewCanEnter(): Promise<void> { return this.API.initAndAuth(false); }

  public changeLanguage(lang: string, fab: any): void {
    console.debug('langage change requested:', lang);
    this.alertCtrl.create({
      title: this.t.instant('IDEA.LANGUAGE_PICKER.APP_WILL_RESTART'),
      buttons: [
        { text: this.t.instant('COMMON.CANCEL'), handler: () => { fab.close(); } },
        { text: this.t.instant('COMMON.CONFIRM'), handler: () =>
          {
            this.storage.set('language', lang).then(() => window.location.assign(''));
            // needed cause sometimes the language isn't update in the interface (random)
          }
        }
      ]
    }).present();
  }
}
