import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import SignaturePad from 'signature_pad';

import { IDEAMessageService } from '../message.service';

@Component({
  selector: 'IDEASignatureComponent',
  templateUrl: 'signature.component.html'
})
export class IDEASignatureComponent {
  protected signature: Signature;
  protected canvas: HTMLCanvasElement;
  protected pad: SignaturePad;

  protected toolbarBgColor: string;
  protected toolbarColor: string;

  protected signatoryError: boolean;
  protected signatureError: boolean;

  constructor(
    protected viewCtrl: ViewController,
    protected navParams: NavParams,
    protected message: IDEAMessageService,
    protected t: TranslateService
  ) {
    this.signature = { signatory: null, pngURL: null, jpegURL: null };
    this.canvas = null;
    this.pad = null;
    //
    this.toolbarBgColor = this.navParams.get('toolbarBgColor') || null;
    this.toolbarColor = this.navParams.get('toolbarColor') || null;
  }
  protected ionViewDidEnter(): void {
    this.canvas = <HTMLCanvasElement> document.getElementById('signatureCanvas');
    this.pad = new SignaturePad(this.canvas);
    this.resizeCanvas();
  }

  /**
   * Clear the canvas.
   */
  protected clear(): void {
    this.pad.clear();
  }

  /**
   * Check Close the window and return the signature (text + different formats).
   */
  protected save(): void {
    this.signatoryError = Boolean(!this.signature.signatory);
    this.signatureError = this.pad.isEmpty();
    if(this.signatoryError || this.signatureError) {
      this.message.show(this.t.instant('IDEA.SIGNATURE.VERIFY_SIGNATORY_AND_SIGNATURE'),
        this.message.TYPE_ERROR);
      return;
    }
    this.signature.jpegURL = this.pad.toDataURL('image/jpeg');
    this.signature.pngURL = this.pad.toDataURL('image/png');
    this.viewCtrl.dismiss(this.signature);
  }

  /**
   * Handling high DPI screens.
   */
  protected resizeCanvas(): void {
    let ratio =  Math.max(window.devicePixelRatio || 1, 1);
    this.canvas.width = this.canvas.offsetWidth * ratio;
    this.canvas.height = this.canvas.offsetHeight * ratio;
    this.canvas.getContext('2d').scale(ratio, ratio);
    this.pad.clear();
  }
}

/**
 * The signature, composed by a signatory and various dataURI formats.
 */
export interface Signature {
  signatory: string;
  pngURL: string;
  jpegURL: string;
}