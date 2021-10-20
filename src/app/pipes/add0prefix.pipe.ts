import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'add0prefix'
})
export class Add0prefixPipe implements PipeTransform {

  transform(value: number | string): string | number {
    console.log(parseInt(value.toString()) < 10 ? `0${parseInt(value.toString())}` : value)
    return parseInt(value.toString()) < 10 ? `0${parseInt(value.toString())}` : value;
  }

}
