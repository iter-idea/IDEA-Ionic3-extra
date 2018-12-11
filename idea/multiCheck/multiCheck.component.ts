import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEACheck } from './check.model';
import { IDEAMultiCheckerComponent } from './multiChecker.component';

@Component({
  selector: 'IDEAMultiCheckComponent',
  templateUrl: 'multiCheck.component.html'
})
export class IDEAMultiCheckComponent {
  @Input() protected data: Array<IDEACheck>;
  /**
   *  Function that returns a Promise<Array<Check>>.
   */
  @Input() protected dataProvider: any;
  @Input() protected label: string;
  @Input() protected searchPlaceholder: string;
  @Input() protected noElementsText: string;
  @Input() protected allCheckedText: string;
  @Input() protected disabled: boolean;
  @Input() protected sortData: boolean;
  @Input() protected numMaxElementsInPreview: number;

  constructor(
    protected modalCtrl: ModalController,
    protected t: TranslateService
  ) {
    this.data = new Array<IDEACheck>();
    this.dataProvider = null;
    this.label = null;
    this.searchPlaceholder = '';
    this.noElementsText = null;
    this.allCheckedText = null;
    this.disabled = false;
    this.sortData = false;
    this.numMaxElementsInPreview = 4;
  }

  /**
   * Fetch the promised data from a function and set it before to open the checks.
   */
  protected fetchDataAndOpenModal(): void {
    if(this.disabled) return;
    if(typeof this.dataProvider === 'function') {
      this.dataProvider()
      .then((data: Array<IDEACheck>) => {
        this.data = data;
        this.openChecker();
      })
      .catch((err: Error) => console.debug(err)); // data will be empty
    }
    else this.openChecker();
  }
  /**
   * Open the checks modal and later fetch the selection (plain value).
   */
  private openChecker(): void {
    if(this.disabled) return;
    // open the modal to let the user pick a suggestion
    this.modalCtrl.create(IDEAMultiCheckerComponent, {
      data: this.data, sortData: this.sortData, searchPlaceholder: this.searchPlaceholder,
      noElementsText: this.noElementsText, allCheckedText: this.allCheckedText
    })
    .present();
  }

  /**
   * Calculate the preview
   */
  protected getPreview(): string {
    if(this.data.every(x => x.checked) || this.data.every(x => !x.checked))
      return this.allCheckedText || this.t.instant('IDEA.MULTICHECK.ALL');
    else {
      let checked = this.data.filter(x => x.checked);
      if(checked.length <= this.numMaxElementsInPreview)
        return this.data
          .filter(x => x.checked)
          .slice(0, this.numMaxElementsInPreview)
          .map(x => x.name)
          .join(', ');
      else return this.t.instant('IDEA.MULTICHECK.NUM_ELEMENTS_SELECTED', {
        num: checked.length
      });
    }
  }
}