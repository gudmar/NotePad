import { Injectable } from '@angular/core';
import { CalendarObjectProviderService } from './calendar-object-provider.service';
import { EventManagerService } from './event-manager.service';
import { ConstantPool } from '@angular/compiler';
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
      let isValid = this.isMinutesValid(event.target.innerText);
      
      if(isValid) {event.target.style.backgroundColor = 'rgb(180, 250, 180'}
      if(!isValid) {event.target.style.backgroundColor = 'rgb(250, 180, 180'}
    })
  }

  setColorsToSummary(event: any, maxVal: number = 50){
    setTimeout(()=>{
      let isValid = this.isSummaryValid(event.target.innerText, maxVal);
      if(isValid) {event.target.style.backgroundColor = 'rgb(180, 250, 180'}
      if(!isValid) {event.target.style.backgroundColor = 'rgb(250, 180, 180'}
    })
  }

  setColorsToHour(event: any){
    setTimeout(()=>{
      let isValid = this.isHoursValid(event.target.innerText);
      // debugger;
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

  setColorsToYearWithLeapYear(event: any, monthInCaseLeapYear:number, dayInCaseLeapYear:number){
    setTimeout(()=>{
      // let isValid = this.isDayValid(dayInCaseLeapYear, monthInCaseLeapYear, event.target.innerText);
      let isValid = this.isYearValidLeapYear(dayInCaseLeapYear, monthInCaseLeapYear, event.target.innerText);
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
  setColorsToMonthWithLeapYear(event: any, yearInCaseLeapYear:number, dayInCaseLeapYear:number){
    let month = event.target.innerText
    setTimeout(()=>{
      // let isValid = this.isMonthValid(month);
      let isValid = this.isMonthValidLeapYear(dayInCaseLeapYear, month, yearInCaseLeapYear)
      if (isValid) 
        // isValid = this.isDayValid(
        //   dayInCaseLeapYear, typeof(month)=='string'?parseInt(month):month-1, yearInCaseLeapYear-1
        // );
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
      let isValid = this.isDayValid(day, month , year);
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
  setEndSummary(event: any, valueIfNotValid: any, maxVal= 50){
    let isValid = this.isSummaryValid(event.target.innerText, maxVal);
    if (!isValid){
      event.target.innerText = valueIfNotValid;
    }
    event.target.style.backgroundColor = '';
  }

  setEndMonth(event: any, valueIfNotValid: any){
    let isValid = this.isMonthValid(event.target.innerText);
    this.setEndMonthGeneral(event, valueIfNotValid, isValid);
    // if (!isValid){
    //   event.target.innerText = valueIfNotValid;
    // }
    // event.target.style.backgroundColor = '';
  }

  setEndMonthWithLeapYear(event: any, yearLeapYear:number, dayLeapYear: number, valueIfNotValid:any){
    let isValid = this.isMonthValidLeapYear(dayLeapYear, event.target.innerText, yearLeapYear)
    this.setEndMonthGeneral(event, valueIfNotValid, isValid);
  }

  isMonthValidLeapYear(day:number | string, month:number | string, year: number | string){
    let isValid = this.isYearValid(year);
    console.log(isValid)
    console.log(this.isMonthValid(month))
    console.log(day, this.toNumberIfNeeded(month), this.toNumberIfNeeded(year))
    console.log(day, month, year)
    console.log('isDya valid ' + this.isDayValid(day, this.toNumberIfNeeded(month), this.toNumberIfNeeded(year)))
    if (isValid) isValid = this.isMonthValid(month)  
    if (isValid) isValid = this.isDayValid(day, this.toNumberIfNeeded(month), this.toNumberIfNeeded(year));
    return isValid;
  }

  toNumberIfNeeded(val:number|string){
    return typeof(val)=='string'?parseInt(val):val;
  }

  private setEndMonthGeneral(event:any, valueIfNotValid:any, isValid:boolean){
    if (!isValid){
      event.target.innerText = valueIfNotValid;
    }
    event.target.style.backgroundColor = '';
  }

  setEndYear(event: any, valueIfNotValid: any){
    // setTimeout(()=>{
    //   let isValid = this.isYearValid(event.target.innerText);
    //   if (!isValid){
    //     event.target.innerText = valueIfNotValid;
    //   }
    //   event.target.style.backgroundColor = '';
    // })
    let isValid = this.isYearValid(event.target.innerText);
    this.setEndYearGeneral(event, valueIfNotValid, isValid);
  }

  setEndYearWithLeapYear(event: any, monthLeapYear:number, dayLeapYear: number, valueIfNotValid:any){
    let isValid = this.isYearValidLeapYear(dayLeapYear, monthLeapYear, event.target.innerText);
    this.setEndYearGeneral(event, valueIfNotValid, isValid);
  }

  isYearValidLeapYear(day:number | string, month:number | string, year: number | string){
    return this.isMonthValidLeapYear(day, month, year);
  }

  private setEndYearGeneral(event: any, valueIfNotValid:any, isValid:boolean){
    setTimeout(()=>{
      if(!isValid){
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

  isMonthValid(valueToTest: number | string){
    return this.is2digitValid(valueToTest, 12);
  }

  isDayValid(day: number | string, month: number, year: number){
    if (this.calendar.getMonthDescriptor(year, month-1) == undefined)  console.warn('isDayValid: undefined');
    if (this.calendar.getMonthDescriptor(year, month-1) == undefined) return false; // debugger;
    let nrOfDaysInMonth = this.calendar.getMonthDescriptor(year, month-1).duration;
    console.log('days in month ' + nrOfDaysInMonth)
    console.log(' year ' + year)
    console.log(day)
    console.log(this.is2digitValid(day, nrOfDaysInMonth))
    return this.is2digitValid(day, nrOfDaysInMonth);
  }

  is2digitValid(valueToTest: number | string, maxVal: number){
    console.log(valueToTest)
    if (valueToTest == '') return false;
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
  isSummaryValid(text: string, maxVal: number = 50){
    return this.summaryValidationFunction(text, maxVal)
  }



  summaryValidationFunction(toValidate: any, maxVal: number = 50){
    return toValidate.toString().length <= maxVal;
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
