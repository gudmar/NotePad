import { Injectable } from '@angular/core';
import { CalendarObjectProviderService } from './calendar-object-provider.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  calendar: CalendarObjectProviderService = new CalendarObjectProviderService();
  constructor() { }

  isYearValid(valueToTest: number ){
    let digitTestPattern = new RegExp("\\d{4}")
    let otherTestPattern = new RegExp('\\D')
    if (!digitTestPattern.test(valueToTest.toString())) return false
    if (otherTestPattern.test(valueToTest.toString())) return false
    if (valueToTest > 3000) return false
    return true;
  }

  isMonthValid(valueToTest: number){
    return this.is2digitValid(valueToTest, 12);
  }

  isDayValid(day: number, month: number, year: number){
    let nrOfDaysInMonth = this.calendar.getMonthDescriptor(year, month).duration;
    return this.is2digitValid(day, nrOfDaysInMonth);
  }

  is2digitValid(valueToTest: number | string, maxVal: number){
    let nonDigitTestPattern = new RegExp('\\D')
    if (nonDigitTestPattern.test(valueToTest.toString())) return false
    if (parseInt(valueToTest.toString()) < 1 || parseInt(valueToTest.toString()) > maxVal) return false
    if (valueToTest.toString().length > 2) return false;
    return true;
  }

  summaryValidationFunction(toValidate: any){
    return toValidate.toString().length <= 50;
  }

  hoursMinutesValidationFunctionFactory(maxVal: number){
    let max = maxVal;
    return (toValidate:string | number) => {
      let digitRe = new RegExp('\\d{1,2}');
      let nonDigitRe = new RegExp('\\D')
      let a = nonDigitRe.test(toValidate.toString())
      let b  = digitRe.test(toValidate.toString())
      if (nonDigitRe.test(toValidate.toString())) return false;
      if (!digitRe.test(toValidate.toString())) return false;
      if (parseInt(toValidate.toString()) < 0 || parseInt(toValidate.toString()) >= maxVal) return false;

      return true;  
    }
  }
  durationValidationFunction(toValidate: string | number){
    let nonDigitRe = new RegExp('\\D')
    if (nonDigitRe.test(toValidate.toString())) return false;
    if (parseInt(toValidate.toString()) > 999) return false
    return true;
  }

}
