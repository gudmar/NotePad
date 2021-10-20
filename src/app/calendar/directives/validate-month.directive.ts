import { Directive, HostListener, Input } from '@angular/core';
import { ValidatorService } from '../services/validator.service';

@Directive({
  selector: '[validateMonth]'
})
export class ValidateMonthDirective {
  @Input('ifNotValid') ifNotValid: any;
  @Input('yearInCaseOfLeapYear') yearInCaseOfLeapYear: number = -1;
  @Input('dayInCaseOfLeapYear')  dayInCaseOfLeapYear: number = -1;
  constructor(private validator: ValidatorService) { }

  @HostListener('mousedown', ['$event'])
  @HostListener('keyup', ['$event'])
  onChange(event: any){
    if (this.dayInCaseOfLeapYear!=-1 && this.yearInCaseOfLeapYear!=-1){
      this.validator.setColorsToMonthWithLeapYear(event, this.yearInCaseOfLeapYear, this.dayInCaseOfLeapYear)
    } else {
      this.validator.setColorsToMonth(event)
    } 
  }

  @HostListener('keydown', ['$event'])
  blurOnEnter(event:any){
    if (event.keyCode === 13){
      event.preventDefault();
      event.target.blur();
    }
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: any){
    if (this.dayInCaseOfLeapYear!=-1 && this.yearInCaseOfLeapYear!=-1){
      this.validator.setEndMonthWithLeapYear(event, this.yearInCaseOfLeapYear, this.dayInCaseOfLeapYear, this.ifNotValid)
    } else {
      this.validator.setEndMonth(event, this.ifNotValid);
    } 
  }
}
