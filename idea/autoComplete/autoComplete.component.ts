import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { IDEASuggestionsComponent } from './suggestions.component';

/**
 * Useful configurations
 *    1. Picker:                            (onSelect), [clearValueAfterSelection]
 *    2. Autocomplete strict:               (onSelect), [value]
 *    3. Autocomplete  allow loose values:  (onSelect), [value], [allowUnlistedValues]
 */
@Component({
  selector: 'IDEAAutoCompleteComponent',
  template: `
    <ion-item>
      <ion-label
        stacked
        *ngIf="label"
      >
        {{ label }}
      </ion-label>
      <ion-input
        [(ngModel)]="value"
        [placeholder]="placeholder"
        [type]="type"
        [readonly]="true"
        [disabled]="disabled"
        (ionFocus)="openSuggestions()"
      >
      </ion-input>
    </ion-item>
  `
})
export class IDEAAutoCompleteComponent {
  @Input() protected data: Array<any>;
  @Input() protected value: string;
  @Input() protected type: string;
  @Input() protected label: string;
  @Input() protected placeholder: string;
  @Input() protected searchPlaceholder: string;
  @Input() protected noSuggestionsText: string;
  @Input() protected disabled: boolean;
  @Input() protected allowUnlistedValues: boolean;
  @Input() protected clearValueAfterSelection: boolean;
  @Input() protected toolbarBgColor: string;
  @Input() protected toolbarColor: string;
  @Output() protected onSelect: EventEmitter<any>;

  constructor(protected modalCtrl: ModalController) {
    this.data = new Array<any>();
    this.value = '';
    this.label = null;
    this.placeholder = '';
    this.searchPlaceholder = '';
    this.noSuggestionsText = null;
    this.disabled = false;
    this.allowUnlistedValues = false;
    this.clearValueAfterSelection = false;
    this.toolbarBgColor = null;
    this.toolbarColor = null;
    this.onSelect = new EventEmitter<any>();
  }

  /**
   * Open the suggestions modal and later fetch the selection.
   */
  protected openSuggestions(): void {
    if(this.disabled) return;
    let modal = this.modalCtrl.create(IDEASuggestionsComponent, {
      data: this.data, value: this.value, searchPlaceholder: this.searchPlaceholder,
      noSuggestionsText: this.noSuggestionsText, allowUnlistedValues: this.allowUnlistedValues,
      clearValueAfterSelection: this.clearValueAfterSelection,
      toolbarBgColor: this.toolbarBgColor, toolbarColor: this.toolbarColor
    });
    modal.onDidDismiss((selection: any) => {
      let selected = selection !== undefined;
      this.value = selected ? selection : this.value;
      if(selected) this.onSelect.emit(this.value);
      if(this.clearValueAfterSelection) this.value = '';
    });
    modal.present();
  }
}