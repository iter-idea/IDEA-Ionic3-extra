import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Injectable()
export class IDEAExtBrowserService {

  constructor(protected sanitizer: DomSanitizer) {}

  public openLink(url: string): void {
    // open a link in a safe way so that also in iOS standalone it will work
    let a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.click();
    a.remove(); // to clean up
  }
  public sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url)
  }
  public sanitizeResourceUrl(resourceUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(resourceUrl);
  }
  public arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for(let i=0; i<len; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  }
}
