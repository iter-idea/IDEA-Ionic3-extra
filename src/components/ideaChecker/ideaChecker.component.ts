import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { IDEACheck } from './IDEACheck.model';

@Component({
  selector: 'IDEACheckerComponent',
  templateUrl: 'IDEAChecker.component.html'
})
export class IDEACheckerComponent {
  title: string;
  IDEAChecks: IDEACheck[];
  filteredIDEAChecks: IDEACheck[];
  searchQuery: string;
  N_PER_PAGE = 30;
  page: number;

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

  checkAll(check: boolean) {
    this.IDEAChecks.forEach(el => el.checked = check);
  }
  search(toSearch?: string) {
    toSearch = (toSearch) ? toSearch.toLowerCase() : '';
    this.filteredIDEAChecks = (this.IDEAChecks.filter((el) =>
      el.value.toLowerCase().indexOf(toSearch) > -1 ))
    .sort((a, b) => { return (a.checked === b.checked)? 0 : a.checked? -1 : 1 })
    .slice(0, this.page * this.N_PER_PAGE);
  }
  filter(ev?: any) {
    this.page = 1; // from page 1 for the new search term
    // take the value of the searchbar (if there's any) and search
    this.search((ev.target.value) ? ev.target.value : '');
  }
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.page += 1;
      this.search(this.searchQuery);
      infiniteScroll.complete();
    }, 500); // the timeout is needed
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
