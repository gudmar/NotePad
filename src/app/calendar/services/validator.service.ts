import { Injectable } from '@angular/core';
import { CalendarObjectProviderService } from './calendar-object-provider.service';
import { EventManagerService } from './event-manager.service';
// import { ConcatSource } from 'webpack-sources';
// import { ConstantPool } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  calendar: CalendarObjectProviderService = new CalendarObjectProviderService(new EventManagerService());
  constructor() { }

  setColorsToDuration(event: any){
    setTimeout(()=>{
      let isValid = this.isDurationValid(event.target.innerText);
      if(isValid) {event.target.style.backgroundColor = 'rgb(180, 250, 180'}
      if(!isValid) {event.target.style.backgroundColor = 'rgb(250, 180, 180'}
    })
  }
  setColorsToMinutes(event: any){
    setTimeout(()=>{
      console.dir(event.target)
      let isValid = this.isMinutesValid(event.target.innerText);
      
      if(isValid) {event.target.style.backgroundColor = 'rgb(180, 250, 180'}
      if(!isValid) {event.target.style.backgroundColor = 'rgb(250, 180, 180'}
    })
  }

  setColorsToSummary(event: any){
    setTimeout(()=>{
      let isValid = this.isSummaryValid(event.target.innerText);
      if(isValid) {event.target.style.backgroundColor = 'rgb(180, 250, 180'}
      if(!isValid) {event.target.style.backgroundColor = 'rgb(250, 180, 180'}
    })
  }

  setColorsToHour(event: any){
    setTimeout(()=>{
      let isValid = this.isHoursValid(event.target.innerText);
      if(isValid) {event.target.style.backgroundColor = 'rgb(180, 250, 180'}
      if(!isValid) {event.target.style.backgroundColor = 'rgb(250, 180, 180'}
    })
  }

  setColorsToYear(event: any){
    setTimeout(()=>{
      let isValid = this.isYearValid(event.target.innerText);
      if(isValid) {event.target.style.backgroundColor = 'rgb(180, 250, 180'}
      if(!isValid) {event.target.style.backgroundColor = 'rgb(250, 180, 180'}
    })
  }

  setColorsToMonth(event: any){
    setTimeout(()=>{
      let isValid = this.isMonthValid(event.target.innerText);
      if(isValid) {event.target.style.backgroundColor = 'rgb(180, 250, 180'}
      if(!isValid) {event.target.style.backgroundColor = 'rgb(250, 180, 180'}
    })
  }

  setColorsToDay(event: any, day: number, month: number, year: number){
    setTimeout(()=>{
      let isValid = this.isDayValid(event.target.innerText, month, year);
      if(isValid) {event.target.style.backgroundColor = 'rgb(180, 250, 180'}
      if(!isValid) {event.target.style.backgroundColor = 'rgb(250, 180, 180'}
    })
  }

  

  setEndDay(event: any, month: number, year: number, valueIfNotValid: any){
    setTimeout(()=>{
      let day = event.target.innerText
      let isValid = this.isDayValid(day, month - 1, year);
      // -1 is difference between real month and js conunting from 0
      if (!isValid){
        event.target.innerText = valueIfNotValid;
      }
      event.target.style.backgroundColor = '';
    })
  }

  setEndHour(event: any, valueIfNotValid: any){
    let isValid = this.isHoursValid(event.target.innerText);
    if (!isValid){
      event.target.innerText = valueIfNotValid;
    }
    event.target.style.backgroundColor = '';
  }
  setEndMinutes(event: any, valueIfNotValid: any){
    let isValid = this.isMinutesValid(event.target.innerText);
    if (!isValid){
      event.target.innerText = valueIfNotValid;
    }
    event.target.style.backgroundColor = '';
  }
  setEndDuration(event: any, valueIfNotValid: any){
    let isValid = this.isDurationValid(event.target.innerText);
    if (!isValid){
      event.target.innerText = valueIfNotValid;
    }
    event.target.style.backgroundColor = '';
  }
  setEndSummary(event: any, valueIfNotValid: any){
    let isValid = this.isSummaryValid(event.target.innerText);
    if (!isValid){
      event.target.innerText = valueIfNotValid;
    }
    event.target.style.backgroundColor = '';
  }



  setEndMonth(event: any, valueIfNotValid: any){
    let isValid = this.isMonthValid(event.target.innerText);
    if (!isValid){
      event.target.innerText = valueIfNotValid;
    }
    event.target.style.backgroundColor = '';
  }


  setEndYear(event: any, valueIfNotValid: any){
    setTimeout(()=>{
    let isValid = this.isYearValid(event.target.innerText);
    if (!isValid){
      event.target.innerText = valueIfNotValid;
    }
    event.target.style.backgroundColor = '';
  })
  }

  isYearValid(valueToTest: number | string ){
    let digitTestPattern = new RegExp("\\d{4}")
    let otherTestPattern = new RegExp('\\D')
    if (!digitTestPattern.test(valueToTest.toString())) return false
    if (otherTestPattern.test(valueToTest.toString())) return false
    if (parseInt(valueToTest.toString()) > 3000) return false
    return true;
  }

  isMonthValid(valueToTest: number){
    return this.is2digitValid(valueToTest, 12);
  }

  isDayValid(day: number | string, month: number, year: number){
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

  isHoursValid(hoursAsNumber: number){
    return this.hoursMinutesValidationFunctionFactory(25)(hoursAsNumber)
  }
  isMinutesValid(minutesAsNumber: number){
    return this.hoursMinutesValidationFunctionFactory(60)(minutesAsNumber)
  }
  isDurationValid(durationAsNumberInMinutes: number){
    return this.durationValidationFunction(durationAsNumberInMinutes)
  }
  isSummaryValid(text: string){
    return this.summaryValidationFunction(text)
  }



  summaryValidationFunction(toValidate: any){
    return toValidate.toString().length <= 50;
  }

  hoursMinutesValidationFunctionFactory(maxVal: number){
    let max = maxVal;
    return (toValidate:string | number) => {
      if (toValidate.toString().length > 2) return false;
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
    if (toValidate.toString()[0] == '0' && toValidate.toString().length>1) return false;
    if (nonDigitRe.test(toValidate.toString())) return false;
    if (parseInt(toValidate.toString()) > 999) return false
    return true;
  }

}
