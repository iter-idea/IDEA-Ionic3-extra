import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { IDEAAWSAPIService } from '../AWSAPI.service';

declare var SimpleMDE: any;
/**
 * Requires to install the following libs (or to keep the CDN) in index.html
 * <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
 * <script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
 */

@Component({
  selector: 'IDEAMarkdownEditorComponent',
  templateUrl: 'mde.component.html'
})
export class IDEAMarkdownEditorComponent {
  protected id: string;
  protected title: string;
  protected header: string
  protected description: string;
  protected variables: Array<string>;
  protected mde: any;

  constructor(
    protected viewCtrl: ViewController,
    protected navParams: NavParams,
    protected API: IDEAAWSAPIService,
    protected t: TranslateService
  ) {
    this.id = this.navParams.get('id') || 'mde';
    this.title = this.navParams.get('title') || this.t.instant('IDEA.MDE.TITLE');
    this.header = this.navParams.get('header');
    this.description = this.navParams.get('description');
    this.variables = this.navParams.get('variables') || [];
    this.mde = null;
  }
  protected ionViewDidEnter(): void {
    this.mde = new SimpleMDE({
      autofocus: this.navParams.get('autofocus'),
      element: document.getElementById(this.id),
      hideIcons: this.navParams.get('hideIcons'),
      initialValue: this.navParams.get('initialValue'),
      placeholder: this.navParams.get('placeholder'),
      showIcons: this.navParams.get('showIcons'),
      spellChecker: this.navParams.get('spellChecker') === false ? false : true,
      status: this.navParams.get('status'),
      toolbarTips: this.navParams.get('toolbarTips') === false ? false : true,
    });
  }

  /**
   * Close without saving.
   */
  protected close(): void {
    this.viewCtrl.dismiss();
  }
  /**
   * Save and close
   */
  protected confirm(): void {
    this.viewCtrl.dismiss(this.mde.value());
  }
}
