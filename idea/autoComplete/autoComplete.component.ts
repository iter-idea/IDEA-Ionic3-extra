import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs/util/noop';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { fromPromise } from 'rxjs/observable/fromPromise';

@Component({
  selector: 'IDEAAutoCompleteComponent',
  templateUrl: 'autoComplete.component.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IDEAAutoCompleteComponent, multi: true }]
})
export class IDEAAutoCompleteComponent implements ControlValueAccessor {
  @Input() public id: string;
  @Input() public dataProvider: any;
  @Input() public label: string;
  @Input() public allowUnlistedValues: boolean;
  @Input() public placeholder: string = '';
  @Input() public autocomplete: string = 'off';
  @Input() public autocorrect: string = 'off';
  @Input() public spellcheck: string = 'off';
  @Input() public type: string = 'search';
  @Input() public debounce: number = 250;
  @Input() public showCancelButton: boolean;
  @Input() public cancelButtonText: string = 'Cancel';
  @Input() public value: string = '';
  @Input() public noItemsText: string;
  @Input() public clearOnEdit: boolean;
  @Input() public clearInput: boolean;
  @Input() public disabled: any;
  @Input() public keyword: string;
  @Input() public showResultsFirst: boolean;
  @Input() public alwaysShowList: boolean;
  @Input() public hideListOnSelection: boolean = true;
  @Input() public template: TemplateRef<any>;
  @Output() public autoFocus: EventEmitter<any>;
  @Output() public autoBlur: EventEmitter<any>;
  @Output() public itemSelected: EventEmitter<any>;
  @Output() public itemsShown: EventEmitter<any>;
  @Output() public itemsHidden: EventEmitter<any>;
  @Output() public ionAutoInput: EventEmitter<string>;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  public suggestions: any[];
  public formValue: any;

  public get showList(): boolean { return this._showList; }
  public set showList(value: boolean) {
    if(this._showList === value) return;
    this._showList = value;
    this.showListChanged = true;
  }
  private _showList: boolean;
  private selection: any;
  private showListChanged: boolean = false;

  public constructor() {
    this.keyword = '';
    this.suggestions = [];
    this._showList = false;
    this.itemSelected = new EventEmitter<any>();
    this.itemsShown = new EventEmitter<any>();
    this.itemsHidden = new EventEmitter<any>();
    this.ionAutoInput = new EventEmitter<string>();
    this.autoFocus = new EventEmitter<any>();
    this.autoBlur = new EventEmitter<any>();
  }

  public handleTap() {
    if(this.showResultsFirst || this.keyword.length > 0) this.getItems();
  }
  public handleSelectTap(event: any, suggestion: any): boolean {
    this.select(suggestion);
    event.srcEvent.stopPropagation();
    event.srcEvent.preventDefault();
    return false;
  }

  public writeValue(value: any) {
    if(value !== this.selection) {
      this.selection = value || null;
      this.formValue = this.getFormValue(this.selection);
      this.keyword = this.getLabel(this.selection);
    }
  }

  public registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  public registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  public updateModel() {
    this.onChangeCallback(this.formValue);
  }

  public ngAfterViewChecked() {
    if(this.showListChanged) {
      this.showListChanged = false;
      this.showList ? this.itemsShown.emit() : this.itemsHidden.emit();
    }
  }

  /**
   * Get items for auto-complete.
   */
  public getItems(e?: Event) {
    let result;
    if(this.showResultsFirst && this.keyword.trim() === '') this.keyword = '';
    else if(this.keyword.trim() === '') {
      this.suggestions = [];
      return;
    }
    if(Array.isArray(this.dataProvider))
      result = this.dataProvider.filter(x =>
        x.toLowerCase().indexOf(this.keyword.toLowerCase()) >= 0);
    else if(typeof this.dataProvider === 'function') result = this.dataProvider(this.keyword);
    else result = this.dataProvider.getResults(this.keyword);
    if(result instanceof Subject) result = result.asObservable();
    if(result instanceof Promise) result = fromPromise(result);
    // if query is async
    if(result instanceof Observable)
      result.subscribe(
        (results: any[]) => {
          this.suggestions = results;
          this.showItemList();
        },
        (error: any) => console.error(error)
      );
    else {
      this.suggestions = result;
      this.showItemList();
    }
    // emit event
    this.ionAutoInput.emit(this.keyword);
    // if allowed by the `allowUnlistedValues` option, directly set the value in the model
    if(this.allowUnlistedValues) {
      this.formValue = this.keyword;
      this.updateModel();
    }
  }

  public showItemList(): void {
    this.showList = true;
  }
  public hideItemList(): void {
    this.showList = this.alwaysShowList;
  }

  public select(selection: any): void {
    this.keyword = this.getLabel(selection);
    this.formValue = this.getFormValue(selection);
    this.hideItemList();
    // emit selection event
    this.updateModel();
    if(this.hideListOnSelection) this.hideItemList();
    // emit selection event
    this.itemSelected.emit(selection);
    this.selection = selection;
  }
  /**
   * Get current selection.
   */
  public getSelection(): any {
    return this.selection;
  }
  /**
   * Get current input value.
   */
  public getValue(): string {
    return this.formValue;
  }
  /**
   * Set current input value.
   */
  public setValue(selection: any) {
    this.formValue = this.getFormValue(selection);
    this.keyword = this.getLabel(selection);
    return;
  }
  /**
   * Clear current input value.
   */
  public clearValue(hideItemList: boolean = false) {
    this.keyword = '';
    this.selection = null;
    this.formValue = null;
    if(hideItemList) this.hideItemList();
    return;
  }

  /**
   * Set focus of the searchbar.
   */
  public setFocus() {
    let searchbar = document.getElementById(this.id);
    if(searchbar) searchbar.focus();
  }
  /**
   * Fired when the input focused.
   */
  public onFocus() {
    this.autoFocus.emit();
    this.handleTap(); // make the showResultsFirst working also on mobile (without a double tap)
  }
  /**
   * Fired when the input blured.
   */
  public onBlur() {
    this.autoBlur.emit(); // additional behaviours than the one here below
    // timeout needed to acquire the possible click event on the list element chosen;
    // otherwise, the blur runs before the click and the suggestions are already gone
    setTimeout(() => {
      // if the values are forced to be in the ones listed (no free entries)
      if(!this.allowUnlistedValues) {
        let k = this.keyword.trim().toLowerCase();
        // check it the keyword matches exactly one of the suggestions;
        //   - if so, fix the field so it assumes the exact value of the suggestion (w/o lowercase);
        //   - if not, blank the field (value not allowed)
        let res = this.suggestions.find(s => s.toLowerCase() == k) || '';
        this.keyword = res;
        this.formValue = res
        this.updateModel();
      }
      this.hideItemList();
    }, 100);
  }

  private getFormValue(selection: any): any {
    if(selection == null) return null;
    let attr = this.dataProvider.formValueAttribute == null ? this.dataProvider.labelAttribute : this.dataProvider.formValueAttribute;
    if(typeof selection === 'object' && attr) return selection[attr];
    return selection;
  }

  private getLabel(selection: any): string {
    if(selection == null) return '';
    let attr = this.dataProvider.labelAttribute;
    let value = selection;
    if(this.dataProvider.getItemLabel) value = this.dataProvider.getItemLabel(value);
    if(typeof value === 'object' && attr) return value[attr] || '';
    return value || '';
  }
}