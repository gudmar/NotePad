import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[PreventEnter]'
})
export class PreventEnterDirective {

  constructor() { }

  @HostListener('keypress', ['$event'])
  preventEnter(event:any){
    if (event.keyCode === 13) event.preventDefault();
  }

}
