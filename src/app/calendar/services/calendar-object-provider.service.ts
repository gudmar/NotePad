import { Injectable } from '@angular/core';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';

@Injectable({
  providedIn: 'root'
})
export class CalendarObjectProviderService {
  date: Date = new Date();
  constructor() { 

  }

  test(){
    let currentDate = Date.now();
    let day = this.date.getDay();
    let month = this.date.getMonth();
    let year = this.date.getFullYear();
    let saturday = new Date("August 22, 2021");
    
    
    console.log(saturday.getDay())
    console.log(day)
    console.log(month)
    console.log(year)
  }

  getMonthObject(year: number, month: number): any[]{
    let descriptor: any = {};
    let monthData = this.getMonthDescriptor(year, month);

    return []
  }

  private getWeekNumber(year: number, month: number, day: number): number{
    let dayIn_ms = 86400000;
    let someDateIn1CW = new Date(this.getDateAsString(year, 0, 4)); // 4 Jan is always 1 CW
    let queriedWeek = new Date(this.getDateAsString(year, month, day));
    let daysFromJan4 = (queriedWeek.getTime() - someDateIn1CW.getTime()) / dayIn_ms;
    let weekNr = 1 + Math.round((daysFromJan4 - 3 + (someDateIn1CW.getDay() + 6)% 7 ) / 7);
    // source: https://weeknumber.com/how-to/javascript  | tested with http://www.whatweekisit.org/
    // needed a lot of refabricatoin
    return weekNr;
  }

  getCW(year: number, month: number, day: number): number{
    let startCWValue = this.getWeekNumber(year, month, day);
    if (startCWValue == 53 || startCWValue == 0) return this.determineCWForBoundryCases(year, startCWValue)
    return startCWValue;
  }

  private determineCWForBoundryCases(year: number, calculatedCWIndex: number){
    let firstJanuaryAsString = calculatedCWIndex > 0 ? 
        this.getDateAsString(year + 1, 0, 1) : 
        this.getDateAsString(year, 0, 1);
    let firstJanuary = new Date(firstJanuaryAsString);
    let firstJanuaryIndex = firstJanuary.getDay();
    let dayIndexesForCW1 = [1, 2, 3, 4]
    let is1CW = dayIndexesForCW1.findIndex((element) => {return element == firstJanuaryIndex}) > -1;
    if (is1CW) return 1;
    if (calculatedCWIndex == 0) return this.getWeekNumber(year - 1, 11, 31);
    return this.getWeekNumber(year, 11, 31)
  }

  getDateAsString(year: number, month: number | string, day: number){
    if (typeof(month) != 'string') month = this.getMonthDescriptor(year, month).name;
    return `${month} ${day}, ${year}`
  }

  getMonthDescriptor(year: number, month: number): {name: string, length: number}{
    let months = [
      {name: 'January',  length: 31},
      {name: 'February',  length: this.isLeapYear(year) ? 29 : 28},
      {name: 'March',     length: 31},
      {name: 'April',     length: 30},
      {name: 'May',       length: 31},
      {name: 'June',      length: 30},
      {name: 'July',      length: 31},
      {name: 'August',    length: 31},
      {name: 'September', length: 30},
      {name: 'October',   length: 31},
      {name: 'November',  length: 30},
      {name: 'December',  length: 31}
    ]
    return months[month]
  }

  getDayName(day: 1 | 2 | 3 | 4 | 5 | 6 | 0): string{
    if( day == 1) return 'Monday';
    if (day == 2) return 'Tuesday';
    if (day == 3) return 'Wednesday';
    if (day == 4) return 'Thursday';
    if (day == 5) return 'Friday';
    if (day == 6) return 'Saturday';
    return 'Sunday';
  }

  isLeapYear(year: number){
    return year % 4 === 0;
  }
}
