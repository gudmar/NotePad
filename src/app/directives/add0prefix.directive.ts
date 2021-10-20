import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[Add0prefix]'
})
export class Add0prefixDirective {

  constructor() { }

  @HostListener('focusout', ['$event'])
  addPrefix(event:any){
    let value = event.target.innerText;
    event.target.innerText = parseInt(value.toString()) < 10 ? `0${parseInt(value.toString())}` : value;
  }

}
