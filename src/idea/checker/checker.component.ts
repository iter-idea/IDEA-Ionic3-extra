import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { IDEACheck } from './check.model';

@Component({
  selector: 'IDEACheckerComponent',
  templateUrl: 'checker.component.html'
})
export class IDEACheckerComponent {
  private title: string;
  private IDEAChecks: IDEACheck[];
  private filteredIDEAChecks: IDEACheck[];
  private searchQuery: string;
  private N_PER_PAGE: number = 30;
  private page: number;

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.title = params.get('title') ? params.get('title') : 'Cerca';
    this.IDEAChecks = <Array<IDEACheck>> params.get('IDEAChecks');
    this.filteredIDEAChecks = new Array<IDEACheck>();
    this.searchQuery = '';
  }
  ionViewWillEnter() {
    this.searchQuery = '';
    this.page = 1;
    this.search();
  }

  public checkAll(check: boolean): void {
    this.IDEAChecks.forEach(el => el.checked = check);
  }
  private search(toSearch?: string): void {
    toSearch = (toSearch) ? toSearch.toLowerCase() : '';
    this.filteredIDEAChecks = (this.IDEAChecks.filter((el) =>
      el.value.toLowerCase().indexOf(toSearch) > -1 ))
    .sort((a, b) => { return (a.checked === b.checked)? 0 : a.checked? -1 : 1 })
    .slice(0, this.page * this.N_PER_PAGE);
  }
  public filter(ev?: any): void {
    this.page = 1; // from page 1 for the new search term
    // take the value of the searchbar (if there's any) and search
    this.search((ev.target.value) ? ev.target.value : '');
  }
  public doInfinite(infiniteScroll): void {
    setTimeout(() => {
      this.page += 1;
      this.search(this.searchQuery);
      infiniteScroll.complete();
    }, 500); // the timeout is needed
  }
  public close(): void {
    this.viewCtrl.dismiss();
  }
}
