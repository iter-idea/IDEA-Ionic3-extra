import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { IDEACheck } from './check.model';
import { IDEAAWSAPIService } from '../AWSAPI.service';

@IonicPage({
  name: 'idea-checker'
})
@Component({
  selector: 'IDEACheckerComponent',
  templateUrl: 'checker.component.html'
})
export class IDEACheckerComponent {
  protected title: string;
  protected checks: IDEACheck[];
  protected filteredChecks: IDEACheck[];
  protected searchQuery: string;
  protected N_PER_PAGE: number = 30;
  protected page: number;

  constructor(
    protected params: NavParams,
    protected viewCtrl: ViewController,
    protected API: IDEAAWSAPIService,
    protected t: TranslateService
  ) {
    this.title = this.params.get('title') || 'Search';
    this.checks = <Array<IDEACheck>> this.params.get('checks');
    this.filteredChecks = new Array<IDEACheck>();
  }
  protected ionViewCanEnter(): Promise<void> { return this.API.initAndAuth(false); }
  protected ionViewWillEnter() { this.clear(); }

  protected clear(): void {
    this.searchQuery = '';
    this.page = 1;
    this.search();
  }
  protected search(toSearch?: string): void {
    toSearch = (toSearch) ? toSearch.toLowerCase() : '';
    this.filteredChecks = this.checks
    .filter(el => el.value.toLowerCase().includes(toSearch))
    .sort((a, b) => {
      // order by checked, visible, value
      if(a.checked && !b.checked) return -1;
      else if(b.checked && !a.checked) return 1;
      else {
        if(a.hidden && !b.hidden) return 1;
        else if(b.hidden && !a.hidden) return -1;
        else return a.value.localeCompare(b.value);
      }
    })
    .slice(0, this.page * this.N_PER_PAGE);
  }
  public filter(ev?: any): void {
    this.page = 1; // from page 1 for the new search term
    // take the value of the searchbar (if there's any) and search
    this.search((ev.target.value) ? ev.target.value : '');
  }
  public doInfinite(infiniteScroll: any): void {
    setTimeout(() => {
      this.page += 1;
      this.search(this.searchQuery);
      infiniteScroll.complete();
    }, 500); // the timeout is needed
  }
  public checkAll(check: boolean): void {
    this.checks.forEach(el => el.checked = check);
  }
  public close(): void {
    this.viewCtrl.dismiss();
  }
}
