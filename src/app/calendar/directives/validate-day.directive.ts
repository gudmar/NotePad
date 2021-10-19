import { Directive, HostListener, Input } from '@angular/core';
import { ValidatorService } from '../services/validator.service';

@Directive({
  selector: '[validateDay]'
})
export class ValidateDayDirective {
  @Input('ifNotValid') ifNotValid: any;
  // @Input('dayToValidate') day: number = 0;
  @Input('monthToValidate') month: number = 0;
  @Input('yearToValidate') year: number = 0;
  constructor(private validator: ValidatorService) { }

  @HostListener('mousedown', ['$event'])
  @HostListener('keydown', ['$event'])
  onChange(event: any){
    this.validator.setColorsToDay(event, event.target.innerText, this.month, this.year)
    console.log(event.target.innerText)
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: any){
    this.validator.setEndDay(event, this.month, this.year, this.ifNotValid);
  }
}
