import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[ValidateMenuTab]'
})
export class ValidateMenuTabDirective {
  @Input('ifNotValid') ifNotValid: any;
  @Input('maxValue') maxValue: number = 15;
  constructor(private elRef: ElementRef) { }
  getLastValidTitle(){
    let currentTitle = this.elRef.nativeElement.innerText;
    if (currentTitle.length > this.maxValue) currentTitle = currentTitle.slice(0, this.maxValue);
    return currentTitle;
  }
  @HostListener('keypress', ['$event'])
  onChange(event: any){
    if (this.elRef.nativeElement.innerText.length > this.maxValue) {
      event.preventDefault();
    }
  }
}
