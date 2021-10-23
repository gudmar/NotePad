import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'add0prefix'
})
export class Add0prefixPipe implements PipeTransform {

  transform(value: number | string): string | number {
    return parseInt(value.toString()) < 10 ? `0${parseInt(value.toString())}` : value;
  }

}
