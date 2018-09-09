import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { IDEASuggestionsComponent, Suggestion } from './suggestions.component';

/**
 * Useful configurations
 *    1. Picker:                           [suggestions], (onSelect), [clearValueAfterSelection]
 *    2. Autocomplete strict:              [suggestions], (onSelect), [value]
 *    3. Autocomplete  allow loose values: [suggestions], (onSelect), [value], [allowUnlistedValues]
 *
 * Data can either be populated directly from the namesake attribute, passing an array of values,
 * or through the _dataProvider_, which is a function that returns a Promise<Array<Suggestion>>,
 * i.e. a promise with an array of Suggestions fetched from somewhere.
 * Tip: to execute from another context, pass to the IDEAAutoCompleteComponent an helper function
 * like the following:
 * ```
    runInContext(methodName: string): any {
      return () => (<any>this)[methodName]();
    }
   ```
 * using it then:
 * ```
    <IDEAAutoCompleteComponent
      [dataProvider]="runInContext('method')"
    ></IDEAAutoCompleteComponent>
 * ```
 */
@Component({
  selector: 'IDEAAutoCompleteComponent',
  templateUrl: 'autoComplete.component.html'
})
export class IDEAAutoCompleteComponent {
  @Input() protected data: Array<Suggestion>;
  /**
   *  Function that returns a Promise<Array<Suggestion>>.
   */
  @Input() protected dataProvider: any;
  @Input() protected value: string;
  @Input() protected type: string;
  @Input() protected label: string;
  @Input() protected placeholder: string;
  @Input() protected searchPlaceholder: string;
  @Input() protected noSuggestionsText: string;
  @Input() protected disabled: boolean;
  @Input() protected allowUnlistedValues: boolean;
  @Input() protected clearValueAfterSelection: boolean;
  @Input() protected hideIdFromUI: boolean;
  @Input() protected toolbarBgColor: string;
  @Input() protected toolbarColor: string;
  @Output() protected onSelect: EventEmitter<any>;

  constructor(protected modalCtrl: ModalController) {
    this.data = new Array<Suggestion>();
    this.dataProvider = null;
    this.value = '';
    this.label = null;
    this.placeholder = '';
    this.searchPlaceholder = '';
    this.noSuggestionsText = null;
    this.disabled = false;
    this.allowUnlistedValues = false;
    this.clearValueAfterSelection = false;
    this.hideIdFromUI = false;
    this.toolbarBgColor = null;
    this.toolbarColor = null;
    this.onSelect = new EventEmitter<any>();
  }

  /**
   * Fetch the promised data from a function and set it before to open the suggestions.
   */
  protected fetchDataAndOpenModal(): void {
    if(this.disabled) return;
    if(typeof this.dataProvider === 'function') {
      this.dataProvider()
      .then((data: Array<Suggestion>) => {
        this.data = data;
        this.openSuggestions();
      })
      .catch((err: Error) => console.debug(err)); // data will be empty
    }
    else this.openSuggestions();
  }
  /**
   * Automatically convers data into Suggestions (e.g. plain strings, numbers, etc.).
   */
  private convertDataInSuggestions(): void {
    this.data = this.data.map((x: any) => {
      if(x.value) return x;
      else return { value: x }; // Suggestion without a name
    });
  }
  /**
   * Open the suggestions modal and later fetch the selection (plain value).
   */
  private openSuggestions(): void {
    if(this.disabled) return;
    // convert optional plain values in Suggestions
    this.convertDataInSuggestions();
    // open the modal to let the user pick a suggestion
    let modal = this.modalCtrl.create(IDEASuggestionsComponent, {
      data: this.data, value: this.value, searchPlaceholder: this.searchPlaceholder,
      noSuggestionsText: this.noSuggestionsText, allowUnlistedValues: this.allowUnlistedValues,
      clearValueAfterSelection: this.clearValueAfterSelection, hideIdFromUI: this.hideIdFromUI,
      toolbarBgColor: this.toolbarBgColor, toolbarColor: this.toolbarColor
    });
    modal.onDidDismiss((selection: Suggestion) => {
      // manage a cancel option (modal dismission or cancel button), a reset or a selection
      let value = selection === undefined || selection === null ? this.value :
        selection.value == '' ? '' : selection.value;
      // emit directly the value (i.e. not the Suggestion object)
      this.onSelect.emit(value);
      // render the suggestion selected; the timeout is needed, otherwise the UI isn't updated
      setTimeout(() => {
        if(this.clearValueAfterSelection) this.value = '';
        else if(selection.name) this.value = selection.name;
        else this.value = value;
      }, 500);
    });
    modal.present();
  }
}