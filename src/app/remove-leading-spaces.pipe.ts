import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeLeadingSpaces'
})
export class RemoveLeadingSpacesPipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      return value.trimStart();
    }
    return '';
  }
}