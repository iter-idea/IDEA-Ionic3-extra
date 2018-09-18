import { Component } from '@angular/core';

@Component({
  selector: 'IDEAOfflineBarComponent',
  templateUrl: 'offlineBar.component.html'
})
export class IDEAOfflineBarComponent {
  protected isOffline: boolean;

  constructor() {
    this.isOffline = !navigator.onLine;
    window.addEventListener('online',  () => this.isOffline = false);
    window.addEventListener('offline', () => this.isOffline = true);
  }
}