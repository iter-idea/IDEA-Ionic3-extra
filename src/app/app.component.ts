import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { TestComponent } from '../test.component';

@Component({
  template: `
    <ion-nav [root]="rootPage" #content main swipeBackEnabled="false"></ion-nav>
  `
})
export class MyApp {
  protected rootPage: any;

  constructor(
    private platform: Platform,
    private storage: Storage,
    private t: TranslateService
  ) {
    this.storage.ready()
    // prepare the language translator
    .then(() => this.storage.get('language'))
    .then(lang => {
      t.addLangs(['en', 'it']);                 // available languages
      t.setDefaultLang('en');                   // default
      t.use(lang ? lang : t.getBrowserLang());  // current
      this.platform.ready()
      .then(() => { this.rootPage = TestComponent });
    });
  }
}
