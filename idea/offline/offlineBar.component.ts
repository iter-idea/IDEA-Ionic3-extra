import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { IDEAOfflineService } from './offline.service';
import { IDEAOfflineManagerComponent } from './offlineManager.component';

@Component({
  selector: 'IDEAOfflineBarComponent',
  templateUrl: 'offlineBar.component.html'
})
export class IDEAOfflineBarComponent {
  @Input() protected offsetBottom: boolean;

  constructor(
    protected modalCtrl: ModalController,
    protected offline: IDEAOfflineService
    ) {}

  protected openOfflineManager(): void {
    this.modalCtrl.create(IDEAOfflineManagerComponent)
    .present();
  }
}