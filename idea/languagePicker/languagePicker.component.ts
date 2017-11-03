import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

// requires two assets folders:
//   1. flags, containing the pngs of each country's flags
//   2. i18n, containing the json of each country's translation

@Component({
  selector: 'IDEALanguagePickerComponent',
  templateUrl: 'languagePicker.component.html'
})
export class IDEALanguagePickerComponent {
  protected languages: Array<string>;

  constructor(protected t: TranslateService, protected storage: Storage) {
    this.languages = t.getLangs();
  }

  public changeLanguage(lang: string, fab: any): void {
    fab.close();
    this.t.use(lang);
    this.storage.set('language', lang);
  }
}
