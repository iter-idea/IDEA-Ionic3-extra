import { Component, ViewChild, HostListener } from '@angular/core';
import { ViewController, NavParams, Searchbar } from 'ionic-angular';

@Component({
  selector: 'IDEASuggestionsComponent',
  templateUrl: 'suggestions.component.html'
})
export class IDEASuggestionsComponent {
  @ViewChild (Searchbar) protected searchbar: Searchbar;
  protected data: Array<any>;
  protected value: string;
  protected searchPlaceholder: string;
  protected noSuggestionsText: string;
  protected allowUnlistedValues: boolean;
  protected toolbarBgColor: string;
  protected toolbarColor: string;

  protected suggestions: Array<any>;

  constructor(
    protected viewCtrl: ViewController,
    protected navParams: NavParams
  ) {
    this.data = this.navParams.get('data') || new Array<any>();
    this.value = this.navParams.get('value') || null;
    this.searchPlaceholder = this.value || this.navParams.get('searchPlaceholder') || null;
    this.noSuggestionsText = this.navParams.get('noSuggestionsText') || null;
    this.allowUnlistedValues = this.navParams.get('allowUnlistedValues') || false;
    this.toolbarBgColor = this.navParams.get('toolbarBgColor') || null;
    this.toolbarColor = this.navParams.get('toolbarColor') || null;
    this.suggestions = new Array<any>();
    this.getSuggestions();
  }
  protected ionViewDidEnter(): void {
    // set the focus / open the keyboard when entering the component
    setTimeout(() => this.searchbar.setFocus(), 100);
  }

  /**
   * Get suggestions while typing into the input.
   */
  protected getSuggestions(ev?: any) {
    // acquire and clean the searchTerm
    let searchTerm = ev && ev.target ? (ev.target.value || '') : '';
    if(searchTerm.trim() === '') searchTerm = '';
    // load the suggestions
    this.suggestions = this.data
      .filter((x: string) => x.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0);
  }

  /**
   * Close the component propagating the choice:
   *    - selection === undefined -> cancel
   *    - selection === null -> clear
   *    - otherwise, a suggestion was selected
   */
  protected select(selection?: any): void {
    this.viewCtrl.dismiss(selection);
  }

  /**
   * Manage the component with the keyboard.
   */
  @HostListener('window:keydown', ['$event'])
  protected navigateComponent(event: KeyboardEvent): void {
    // identify the suggestions list
    let suggestionsList;
    if(document.getElementsByClassName('suggestionsList').length)
      suggestionsList = document.getElementsByClassName('suggestionsList')[0];
    // identify the action to execute based on the key pressed
    switch(event.keyCode) {
      case 13:
        // quick confirm of the selection, based on what is on in the component
        if(suggestionsList && suggestionsList.getElementsByClassName('selected').length)
          this.select(suggestionsList.getElementsByClassName('selected')[0]   // selected
            .textContent.trim());
        else if(this.allowUnlistedValues && this.searchbar.value)
          this.select(this.searchbar.value);                                  // loose value
        else if(this.suggestions.length == 0) this.select();                  // cancel
        else this.select(this.suggestions[0]);                                // first element
      break;
      case 38:
      case 40:
        if(!suggestionsList) return;
        // identify the currently selected suggestion or select the first one
        let selected = null;
        let elements = suggestionsList.getElementsByClassName('selected');
        if(elements.length) {
          // a suggestion was already selected: go to the next/previous one
          selected = elements[0];
          if(selected) {
            selected.classList.remove('selected');
            if(event.keyCode == 40) selected = selected.nextElementSibling;
            else selected = selected.previousElementSibling;
          }
        }
        else {
          // no suggestions selected yet: select the first one
          elements = suggestionsList.getElementsByClassName('suggestion');
          if(elements.length) selected = elements[0];
        }
        // execute the selection
        if(selected) selected.classList.add('selected');
      break;
    }
  }
}