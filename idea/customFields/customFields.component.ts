import { Component, Input } from '@angular/core';
import { ModalController, Events, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import IdeaX = require('idea-toolbox');

import { IDEAMessageService } from '../message.service';
import { IDEACustomFieldManagerComponent } from './customFieldManager.component';

@Component({
  selector: 'IDEACustomFieldsComponent',
  templateUrl: 'customFields.component.html'
})
export class IDEACustomFieldsComponent {
  /**
   * Ordered list of the fields (names) to expect.
   *
   * e.g. [ 'tShirtSize', 'favColor', ... ]
   */
  @Input() public fieldsLegend: Array<string>;
  /**
   * Object containing attributes of type CustomField.
   *
   * e.g.
   *
   *    fields.tShirtSize: CustomField;
   *    fields.favColor: CustomField;
   *    ...
   */
  @Input() protected fields: any;
  /**
   * Default (fallback) language for Label fields.
   */
  @Input() protected defaultLang: string;
  /**
   * Current language to display for Label fields.
   */
  @Input() protected currentLang: string;
  /**
   * Available languages for Label fields.
   */
  @Input() protected availableLangs: Array<string>;
  /**
   * Toolbar scss bg color.
   */
  @Input() protected toolbarBgColor: string;
  /**
   * Toolbar scss font color.
   */
  @Input() protected toolbarColor: string;
  /**
   * If true, the customFieldManager won't open when the field is clicked.
   */
  @Input() protected disabled: boolean;

  constructor(
    protected modalCtrl: ModalController,
    protected alertCtrl: AlertController,
    protected events: Events,
    protected message: IDEAMessageService,
    protected t: TranslateService
  ) {
    // listen for a "add a custom field" event
    this.events.unsubscribe('IDEACustomFieldsComponent:new');
    this.events.subscribe('IDEACustomFieldsComponent:new', () => this.addNewField());
  }

  /**
   * Ask the key for a new field and open the manager to configure it.
   */
  protected addNewField(): void {
    this.alertCtrl.create({
      title: this.t.instant('IDEA.CUSTOM_FIELDS.NEW_FIELD'),
      subTitle: this.t.instant('IDEA.CUSTOM_FIELDS.CHOOSE_A_KEY'),
      inputs: [{ name: 'fieldKey' }],
      buttons: [
        { text: this.t.instant('COMMON.CANCEL') },
        { text: this.t.instant('COMMON.CONFIRM'),
          handler: (data: any) => {
            let name = data.fieldKey;
            // clean the key to avoid weird chars in the JSON
            let key = name.replace(/[^\w\d]/g, '');
            if(key && key.trim().length) {
              if(this.fieldsLegend.some(x => x == key)) {
                this.message.show(this.t.instant('IDEA.CUSTOM_FIELDS.DUPLICATED_KEY'),
                  this.message.TYPE_ERROR);
              } else {
                // add the new field and open the field manager to configure it
                this.fieldsLegend.push(key);
                this.fields[key] = new IdeaX.CustomField(this.availableLangs);
                this.fields[key].name[this.defaultLang] = name;
                this.openManager(key);
              }
            }
          }
        }
      ]
    })
    .present()
    .then(() => {
      // focus on the input, right away
      const firstInput: any = document.querySelector('ion-alert input');
      firstInput.focus();
      return;
    });
  }

  /**
   * Open the custom field manager.
   */
  protected openManager(fieldKey: string): void {
    if(this.disabled) return;
    let modal = this.modalCtrl.create(IDEACustomFieldManagerComponent, {
      field: this.fields[fieldKey], fieldKey: fieldKey,
      defaultLang: this.defaultLang, currentLang: this.currentLang,
      availableLangs: this.availableLangs,
      toolbarBgColor: this.toolbarBgColor, toolbarColor: this.toolbarColor
    });
    modal.onDidDismiss((field: IdeaX.CustomField | boolean) => {
      if(field === false) {
        // deletion requested
        this.fieldsLegend.splice(this.fieldsLegend.indexOf(fieldKey), 1);
        delete this.fields[fieldKey];
      }
      // update the field (we worked on a copy)
      else if(field) this.fields[fieldKey] = field;
    });
    modal.present();
  }
}
