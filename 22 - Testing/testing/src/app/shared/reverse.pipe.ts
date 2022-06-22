import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform{
  transform(value: string, ...args:any[]): any {
    return value.split('').reverse().join('');
  }
}
