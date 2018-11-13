import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { IDEASuggestionsComponent, Suggestion } from './suggestions.component';

/**
 * Useful configurations
 *    1. Picker:             [suggestions], (onSelect), [clearValueAfterSelection]
 *    2. Strict:             [suggestions], (onSelect), [description]
 *    3. Allow loose values: [suggestions], (onSelect), [description], [allowUnlistedValues]
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
  /**
   * The description to show in the field.
   * Set the property so it detects changes.
   */
  private _description: string;
  get description(): string { return this._description; }
  @Input() set description(description: string) { this._description = description; }

  @Input() protected data: Array<Suggestion>;
  /**
   *  Function that returns a Promise<Array<Suggestion>>.
   */
  @Input() protected dataProvider: any;
  @Input() protected type: string;
  @Input() protected label: string;
  @Input() protected placeholder: string;
  @Input() protected searchPlaceholder: string;
  @Input() protected noSuggestionsText: string;
  @Input() protected disabled: boolean;
  @Input() protected obligatory: boolean;
  @Input() protected allowUnlistedValues: boolean;
  @Input() protected sortData: boolean;
  @Input() protected clearValueAfterSelection: boolean;
  @Input() protected hideIdFromUI: boolean;
  @Input() protected toolbarBgColor: string;
  @Input() protected toolbarColor: string;
  @Output() protected onSelect: EventEmitter<Suggestion>;

  constructor(protected modalCtrl: ModalController) {
    this.data = new Array<Suggestion>();
    this.dataProvider = null;
    this.label = null;
    this.description = '';
    this.placeholder = '';
    this.searchPlaceholder = '';
    this.noSuggestionsText = null;
    this.disabled = false;
    this.obligatory = false;
    this.allowUnlistedValues = false;
    this.sortData = false;
    this.clearValueAfterSelection = false;
    this.hideIdFromUI = false;
    this.toolbarBgColor = null;
    this.toolbarColor = null;
    this.onSelect = new EventEmitter<Suggestion>();
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
   * Automatically convers data into Suggestions (from plain strings, numbers, etc.).
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
      data: this.data, sortData: this.sortData, searchPlaceholder: this.searchPlaceholder,
      noSuggestionsText: this.noSuggestionsText, allowUnlistedValues: this.allowUnlistedValues,
      clearValueAfterSelection: this.clearValueAfterSelection, hideIdFromUI: this.hideIdFromUI,
      toolbarBgColor: this.toolbarBgColor, toolbarColor: this.toolbarColor
    });
    modal.onDidDismiss((selection: Suggestion) => {
      // manage a cancel option (modal dismission or cancel button)
      if(selection === undefined || selection === null) return;
      // manage a reset ('') or a selection
      this.onSelect.emit(selection.value ? selection : new Suggestion());
      // render the suggestion selected
      if(this.clearValueAfterSelection) this.description = '';
      else if(selection.name) this.description = selection.name;
      else this.description = selection.value;
    });
    modal.present();
  }
}