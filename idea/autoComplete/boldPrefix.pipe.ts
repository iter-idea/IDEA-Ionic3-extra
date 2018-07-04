import { Injectable, PipeTransform, Pipe } from '@angular/core';

/**
 * Bolds the beggining of the matching string in the item.
 */
@Pipe({
  name: 'boldprefix'
})
@Injectable()
export class IDEABoldPrefix implements PipeTransform {
  transform(value: string, keyword: string): any {
    if(!keyword) return value;
    let escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return value.replace(new RegExp(escapedKeyword, 'gi'), str => { return str.bold(); });
  }
}