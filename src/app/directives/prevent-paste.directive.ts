import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[PreventPaste]'
})
export class PreventPasteDirective {

  constructor() { }

  @HostListener('paste', ['$event'])
  preventPaste(event:any){
    event.preventDefault();
  }
}
