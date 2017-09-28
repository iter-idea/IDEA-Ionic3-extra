import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from 'ng2-translate/ng2-translate';

// requires two assets folders:
//   1. flags, containing the pngs of each country's flags
//   2. i18n, containing the json of each country's translation

@Component({
  selector: 'languagePicker',
  template: `
    <ion-fab top right edge #languagePicker id="languagePicker">
      <button ion-fab mini color="light" class="flagBtn">
        <img src="assets/flags/{{ t.currentLang }}.png" />
      </button>
      <ion-fab-list>
        <button ion-fab mini color="light" class="flagBtn"
          *ngFor="let l of languages"
          (click)="changeLanguage(l, languagePicker)"
        >
          <img src="assets/flags/{{ l }}.png" />
        </button>
      </ion-fab-list>
    </ion-fab>
  `,
  styles: [`
    #languagePicker { top: 25px; }
    .fab[mini].flagBtn {
      width: 40px;
      height: 40px;
      z-index: 99999; /* otherwise is covered by the header in some occasions */
      box-shadow: 0 3px 12px 2px rgba(0, 0, 0, 0.3);
    }
  `]
})
export class IDEALanguagePickerComponent {
  private languages: Array<string>;

  constructor(private t: TranslateService, private storage: Storage) {
    this.languages = t.getLangs();
  }

  public changeLanguage(lang: string, fab: any): void {
    fab.close();
    this.t.use(lang);
    this.storage.set('language', lang);
  }
}
