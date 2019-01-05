import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  pure: false
})
export class SortPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });
  }
}
