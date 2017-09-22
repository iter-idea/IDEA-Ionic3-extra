import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { TestComponent } from '../test.component';

@Component({
  template: `
    <ion-nav [root]="rootPage" #content main swipeBackEnabled="false"></ion-nav>
  `
})
export class MyApp {
  private rootPage: any;

  constructor(private platform: Platform) {
    this.platform.ready()
    .then(() => { this.rootPage = TestComponent });
  }
}
