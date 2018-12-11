import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams, Searchbar } from 'ionic-angular';

import { IDEACheck } from './check.model';

@Component({
  selector: 'IDEAMultiCheckerComponent',
  templateUrl: 'multiChecker.component.html'
})
export class IDEAMultiCheckerComponent {
  @ViewChild (Searchbar) protected searchbar: Searchbar;
  /**
   * It should be read only until the component closure.
   */
  protected data: Array<IDEACheck>;
  /**
   * A copy of data, to use until the changes are confirmed.
   */
  protected workingData: Array<IDEACheck>;
  /**
   * If true, sort alphabetically the data.
   */
  protected sortData: boolean;
  /**
   * A placeholder for the searchbar.
   */
  protected searchPlaceholder: string;
  /**
   * The text to show in case no element is found after a search.
   */
  protected noElementsText: string;

  // SUPPORT
  protected filteredChecks: Array<IDEACheck>;
  protected N_PER_PAGE: number = 30;
  protected page: number;

  constructor(
    protected viewCtrl: ViewController,
    protected navParams: NavParams
  ) {
    this.data = this.navParams.get('data') || new Array<IDEACheck>();
    this.workingData = JSON.parse(JSON.stringify(this.data));
    this.sortData = Boolean(this.navParams.get('sortData'));
    this.searchPlaceholder = this.navParams.get('searchPlaceholder') || null;
    this.noElementsText = this.navParams.get('noElementsText') || null;
    //
    this.filteredChecks = new Array<IDEACheck>();
    if(this.sortData)
      this.workingData = this.workingData.sort((a, b) => a.name.localeCompare(b.name));
    this.filterChecks();
  }
  protected ionViewDidEnter(): void {
    // set the focus / open the keyboard when entering the component
    setTimeout(() => this.searchbar.setFocus(), 100);
  }

  /**
   * Get checks suggestions while typing into the input.
   */
  protected filterChecks(ev?: any) {
    // acquire and clean the search term
    let searchTerm = ev && ev.target ? (ev.target.value || '') : '';
    if(!searchTerm.trim().length) searchTerm = '';
    searchTerm = searchTerm.toLowerCase();
    // filter the elements based on the search
    this.filteredChecks = this.workingData
      .filter(x => !x.hidden)
      .filter((x) => `${x.name} ${x.value}`.toLowerCase().indexOf(searchTerm) >= 0);
  }

  /**
   * Check/unckeck all the elements.
   */
  protected checkAll(check: boolean): void {
    this.filteredChecks.forEach(x => x.checked = check);
  }

  /**
   * Close without confirming the changes.
   */
  protected cancel(): void {
    this.viewCtrl.dismiss(false);
  }
  /**
   * Close applying the changes to the original data structure.
   */
  protected confirm(): void {
    this.workingData.forEach(x => this.data.find(y => x.value == y.value).checked = x.checked);
    this.viewCtrl.dismiss(true);
  }
}