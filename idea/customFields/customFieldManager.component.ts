import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import IdeaX = require('idea-toolbox');

const DEFAULT_LANGUAGE: string = 'en';

@Component({
  selector: 'IDEACustomFieldManagerComponent',
  templateUrl: 'customFieldManager.component.html'
})
export class IDEACustomFieldManagerComponent {
  protected field: IdeaX.CustomField;
  protected fieldKey: string;
  protected defaultLang: string;
  protected currentLang: string;
  protected availableLangs: Array<string>;
  protected toolbarBgColor: string;
  protected toolbarColor: string;

  protected errors: Array<string>;
  protected FIELD_TYPES: Array<string> = Object.keys(IdeaX.CustomFieldTypes);
  protected enumAsString: string;

  constructor(
    protected viewCtrl: ViewController,
    protected alertCtrl: AlertController,
    protected navParams: NavParams,
    protected t: TranslateService
  ) {
    this.defaultLang = this.navParams.get('defaultLang') || DEFAULT_LANGUAGE;
    this.currentLang = this.navParams.get('currentLang') || DEFAULT_LANGUAGE;
    this.availableLangs = this.navParams.get('availableLangs') || [DEFAULT_LANGUAGE];
    this.field = new IdeaX.CustomField(this.availableLangs);
    this.field.load(this.navParams.get('field'), this.availableLangs); // we work on a copy
    this.fieldKey = this.navParams.get('fieldKey');
    if(!this.field || !this.fieldKey) this.close();
    this.toolbarBgColor = this.navParams.get('toolbarBgColor');
    this.toolbarColor = this.navParams.get('toolbarColor');
    //
    this.errors = Array<string>();
    this.enumAsString = (this.field.enum || []).join(', ');
  }

  /**
   * Set the support array to display errors in the UI.
   */
  protected hasFieldAnError(field: string): boolean {
    return this.errors.some(e => e == field);
  }

  /**
   * Return the modified field and close.
   */
  protected save(): void {
    // convert and clean the string enum (reset the enum if the type isn't correct)
    if(this.field.type == IdeaX.CustomFieldTypes.ENUM) {
      this.field.enum =
        Array.from(new Set(this.enumAsString.split(',').map(x => x.trim()).filter(x => x)));
      if(!this.field.enum.length) this.field.enum = null;
    } else this.field.enum = null;
    // reset obligatory if field is boolean
    if(this.field.type == IdeaX.CustomFieldTypes.BOOLEAN) {
      this.field.obligatory = false;
      this.field.default = null;
    }
    // reset min/max if field isn't number
    if(this.field.type != IdeaX.CustomFieldTypes.NUMBER) {
      this.field.min = null;
      this.field.max = null;
    }
    // checkings
    this.errors = this.field.validate(this.defaultLang);
    if(this.errors.length) return;
    // return the cleaned field
    this.viewCtrl.dismiss(this.field);
  }

  /**
   * Close reporting the field deletion.
   */
  protected delete(): void {
    this.alertCtrl.create({
      title: this.t.instant('COMMON.ARE_YOU_SURE'),
      message: this.t.instant('IDEA.CUSTOM_FIELDS.FIELD_DELETION_ALERT'),
      buttons: [
        { text: this.t.instant('COMMON.CANCEL') },
        { text: this.t.instant('COMMON.CONFIRM'), handler: () => { this.viewCtrl.dismiss(false) } }
      ]
    }).present();
  }

  /**
   * Close without reporting any change.
   */
  protected close(): void {
    this.viewCtrl.dismiss();
  }
}
