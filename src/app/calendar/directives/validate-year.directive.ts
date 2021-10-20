import { Directive, HostListener, Input } from '@angular/core';
import { ValidatorService } from '../services/validator.service';

@Directive({
  selector: '[validateYear]',
  providers: [ValidatorService]
})
export class ValidateYearDirective {
  @Input('ifNotValid') ifNotValid: any;
  constructor(private validator: ValidatorService) { }
  @Input('monthInCaseOfLeapYear') monthInCaseOfLeapYear: number = -1;
  @Input('dayInCaseOfLeapYear')  dayInCaseOfLeapYear: number = -1;

  @HostListener('mousedown', ['$event'])
  @HostListener('keyup', ['$event'])
  onChange(event: any){
    if (this.dayInCaseOfLeapYear!=-1 && this.monthInCaseOfLeapYear!=-1){
      this.validator.setColorsToYearWithLeapYear(event, this.monthInCaseOfLeapYear, this.dayInCaseOfLeapYear)
    } else {
      this.validator.setColorsToYear(event)
    } 
  }

  @HostListener('keydown', ['$event'])
  blurOnEnter(event:any){
    if (event.keyCode === 13){
      event.preventDefault();
      event.target.blur();
    }
  }

  // @HostListener('keypress', ['$event'])
  // preventEnter(event:any){
  //   if (event.keyCode === 13) event.preventDefault();
  // }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: any){
    if (this.dayInCaseOfLeapYear!=-1 && this.monthInCaseOfLeapYear!=-1){
      if (this.monthInCaseOfLeapYear == 2 && this.dayInCaseOfLeapYear == 29){
        this.validator.setEndYearWithLeapYear(
          event, this.monthInCaseOfLeapYear, this.dayInCaseOfLeapYear, this.getNearestLeapYear(this.ifNotValid)
        )
      } else {
        this.validator.setEndYearWithLeapYear(
          event, this.monthInCaseOfLeapYear, this.dayInCaseOfLeapYear, this.ifNotValid
        )        
      }
    } else {
      this.validator.setEndYear(event, this.ifNotValid);
    } 
  }

  getNearestLeapYear(currentYear:number){
    let divider = Math.floor(currentYear / 4);
    return divider * 4;
  }
}
