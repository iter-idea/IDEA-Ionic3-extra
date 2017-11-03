import { Injectable } from '@angular/core';

@Injectable()
export class ExtBrowserService {

  constructor() {}

  public openLink(url: string): void {
    // open a link in a safe way so that also in iOS standalone it will work
    let a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.click();
    a.remove(); // to clean up
  }
}
