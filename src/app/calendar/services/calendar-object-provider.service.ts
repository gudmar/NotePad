import { Injectable, ConstructorProvider } from '@angular/core';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { start } from 'repl';
import { EventManagerService } from './event-manager.service'
import { POINT_CONVERSION_COMPRESSED } from 'constants';
import { ConstantPool } from '@angular/compiler';
import { ConcatSource } from 'webpack-sources';
import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';



@Injectable()
export class CalendarObjectProviderService {




  date: Date = new Date();
  eventManager = new EventManagerService();
  events: any = [];
  constructor() { 
  }

  getYearAsObject(year: number, events?: any[]){
    let descriptor: any = {
      year: year,
      months: []
    }
    let monthIndexes = this.getMonthsAsArray(0, 11);
    for(let month of monthIndexes){
      let monthDescriptor = this.getMonthDescriptor(year, month);
      let singleMonth: any = {
        monthIndex: month,
        monthName: monthDescriptor.name,
        weeks: this.getMonthObject(year, month, this.events)
      };
      descriptor.months.push(singleMonth)
    }
    return descriptor
  }

  getMonthObject(year: number, month: number, events?: any[]): any[]{
    let descriptor: any[] = [];
    let calendarWeeks = this.getCWNumbersForMonth(year, month);
    for(let cw of calendarWeeks){
      let cwDescriptor: any = {
        cwIndex: cw,
        days: month==0 && cw>51 ? this.getDaysOfCW(year-1, cw): this.getDaysOfCW(year, cw)
      }
      descriptor.push(cwDescriptor)
    }
    return descriptor

    // weeks: {
    //   [cwIndex: 33,
    //     days: {
    //       {dayIndex: 31, dayName: Saturday, month: 10},
    //       {dayIndex: 1, dayName: Sunday, month: 11}
    //     }
    //   ]
    // }
  }

  getDaysOfCW(year: number, cw: number){
    let firstCWDayDate = this.getDateOfFirstCWDay(year, cw);
    let weekDuration = 7;
    let arrayOfCWDays: any[] = [];
    let currentDate = firstCWDayDate;
    for (let day=0; day < weekDuration; day++){
      arrayOfCWDays.push(this.getSingleDayDescriptor(currentDate));
      currentDate = this.getNextDay(currentDate);
    }
    return arrayOfCWDays;
  }

  getSingleDayDescriptor(date: {year: number, month: number, day: number}): any {
    let dateAsString = this.getDateAsString(date.year, date.month, date.day);
    let dateAsObject = this.getDateObject(date.year, date.month, date.day);
    // if (this.events == undefined) events = [];
    let eventsForTheDay = this.eventManager.fetchDayEvents(date.year, date.month, date.day, this.events)
    function convertDayIndex(dayIndexSaturday0: number) {
      return dayIndexSaturday0 == 0 ? 7 : dayIndexSaturday0;
    }
    return { 
      dayMonthIndex: date.day, 
      dayWeekIndex: convertDayIndex(dateAsObject.getDay()),
      dayName: this.getDayName(dateAsObject.getDay()),
      month: date.month,
      year: date.year,
      events: eventsForTheDay
    }
  }

  getNextDay(date: {year: number, month: number, day: number}): {year: number, month:number, day:number}{
    let monthDescriptor = this.getMonthDescriptor(date.year, date.month)
    let nextDay = date.day + 1;
    let nextMonth = date.month;
    let nextYear = date.year;
    if (nextDay > monthDescriptor.duration) {nextDay = 1; nextMonth++;}
    if (nextMonth > 11) {nextMonth = 0; nextYear++;}
    return {year: nextYear, month: nextMonth, day: nextDay}
  }
  getPreviousDay(date: {year: number, month: number, day: number}):
                       {year: number, month: number, day: number}{
    let prevDate = {year: date.year, month: date.month, day: date.day}
    let prevDay = date.day - 1;
    if (prevDay > 0) {
      prevDate.day = prevDay; return prevDate;
    }
    let prevMonth = date.month - 1;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevDate.year = prevDate.year - 1;
    }
    prevDate.day = this.getMonthDescriptor(date.year, date.month).duration;
    return prevDate;
  }

  getCWNumbersForMonth(year: number, month: number){
    let monthData: any = this.getMonthDescriptor(year, month);
    let lastDayOfMonthIndex = monthData.duration;
    let cwIndexes = [];
    let lastCW = 0;
    for (let dayIndex=1; dayIndex <= lastDayOfMonthIndex; dayIndex++){
      let currentCW = this.getCW(year, month, dayIndex);
      if (currentCW != lastCW) {
        cwIndexes.push(currentCW);
        lastCW = currentCW;
      }
    }
    return cwIndexes;
  }

  getDateOfLastCWDay(year: number, cwIndex: number){
    let firstDayOfCWDate = this.getDateOfFirstCWDay(year, cwIndex);
    if (firstDayOfCWDate.day == -1) return {year: -1, day: -1, month: -1}
    let lastDayOfCW = firstDayOfCWDate.day + 6;
    let month = firstDayOfCWDate.month
    let nrOfDaysInMonth = this.getMonthDescriptor(year, month).duration;
    
    if (nrOfDaysInMonth < lastDayOfCW) {
      let correctedLastDayOfCW = lastDayOfCW - nrOfDaysInMonth;
      if (month == 11) return {year: firstDayOfCWDate.year + 1, month: 0, day: correctedLastDayOfCW}
      return {year: firstDayOfCWDate.year, month: month + 1, day: correctedLastDayOfCW}
    }
    return {year: firstDayOfCWDate.year, month: firstDayOfCWDate.month, day: lastDayOfCW};
  }

  getDateOfFirstCWDay(year:number, cwIndex: number){
    let that = this
    if (cwIndex > 51) return this.getDateOfFirstCWDay_startDate_endDate(year, cwIndex, 10);
    if (cwIndex == 1) {
      let startOfCW1FromPreviousYear = this.getDateOfFirstCWDay_startDate_endDate(year - 1, cwIndex, 10);
      if (startOfCW1FromPreviousYear.day != -1) return startOfCW1FromPreviousYear
    }
    let a = Math.floor(cwIndex / 4)
    
    let lowBoundry = Math.floor(cwIndex / 4) - 1;
    let highBoundry = Math.floor(cwIndex / 4) + 2;
    if (lowBoundry < 0) lowBoundry = 0;
    if (highBoundry > 11) highBoundry = 11;
    if (lowBoundry > 10) lowBoundry = 10;
    // console.log(`search ${cwIndex} in ${lowBoundry}    ${highBoundry}`)
    return this.getDateOfFirstCWDay_startDate_endDate(year, cwIndex)

  }

  // PROVATES

  getDateOfFirstCWDay_startDate_endDate(year:number, cwIndex: number, startMonth?: number, endMonth?: number){
    let that = this;
    let firstMatchFunction = function(year: number, month: number, day: number){
      return that.getCW(year, month, day) === cwIndex;
    }
    let firstMatchingDate = this.findFirstDayInYearMatchingCriteria(year, 
        firstMatchFunction, 
        startMonth, 
        endMonth
      )
    return firstMatchingDate
  }

  findFirstDayInYearMatchingCriteria(year: number, cb: Function, startFromMonth?: number, endMonth?: number){
    if (startFromMonth == undefined) startFromMonth = 0;
    if (endMonth == undefined) endMonth = 11;
    let months: number[] = this.getMonthsAsArray(startFromMonth, endMonth);
    let matchedDay: number = -1;
    let that = this;
    let singleMatch = function(element: any, index: number){
      let indexOfMatchedForCurrentMonth = that.findFirstDayInMonthMatchingCriteria(year, months[index], cb);
      if (indexOfMatchedForCurrentMonth != -1) {
        matchedDay = indexOfMatchedForCurrentMonth;
        return true;
      }
      return false;
    }
    let monthMatchingCriteria = months[months.findIndex(singleMatch)];
    return {day: matchedDay, month: monthMatchingCriteria, year: year}
  }
  

  findFirstDayInMonthMatchingCriteria(year: number, month: number, cb: Function){
    let daysOfMonth = this.getDaysOfMonthAsArray(year, month);
    let singleMatch = function(element: any, index: number) {return cb(year, month, index + 1);}
    let foundIndex = daysOfMonth.findIndex(singleMatch)
    return foundIndex == -1 ? -1 : foundIndex + 1;
  }

  getMonthsAsArray(startMonth: number, endMonth: number) {
    let monthArray = [];
    if (startMonth > endMonth) return [];
    if (startMonth > 11) return [];
    if (endMonth > 11) return [];
    for (let i=startMonth; i<=endMonth; i++){
      monthArray.push(i)
    }

    return monthArray;
  }

   getDaysOfMonthAsArray(year: number, month: number){
    let nrOfDays = this.getMonthDescriptor(year, month).duration;
    let foundDayIndex = -1;
    let daysOfMonth: number[] = [];
    for (let dayIndex=1; dayIndex <= nrOfDays; dayIndex++){daysOfMonth.push(dayIndex)}
    return daysOfMonth
  }

  getDateObject(year: number, month: number, day: number){
    return new Date(this.getDateAsString(year, month, day));
  }

  getCW(year: number, month: number, day: number): number{
    let startCWValue = this.getWeekNumber(year, month, day);
    if (startCWValue == 53 || startCWValue == 0) return this.determineCWForBoundryCases(year, startCWValue)
    return startCWValue;
  }

  getDateAsString(year: number, month: number | string, day: number){
    if (typeof(month) != 'string') month = this.getMonthDescriptor(year, month).name;
    return `${month} ${day}, ${year}`
  }

  injectEvents(events: any){this.events = events}

  getMonthDescriptor(year: number, month: number): {name: string, duration: number}{
    let months = [
      {name: 'January',   duration: 31},
      {name: 'February',  duration: this.isLeapYear(year) ? 29 : 28},
      {name: 'March',     duration: 31},
      {name: 'April',     duration: 30},
      {name: 'May',       duration: 31},
      {name: 'June',      duration: 30},
      {name: 'July',      duration: 31},
      {name: 'August',    duration: 31},
      {name: 'September', duration: 30},
      {name: 'October',   duration: 31},
      {name: 'November',  duration: 30},
      {name: 'December',  duration: 31}
    ]
    return months[month]
  }

  getDayName(day: number): string{
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


  determineCWForBoundryCases(year: number, calculatedCWIndex: number){
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

  getWeekNumber(year: number, month: number, day: number): number{
    let dayIn_ms = 86400000;
    let someDateIn1CW = new Date(this.getDateAsString(year, 0, 4)); // 4 Jan is always 1 CW
    let queriedWeek = new Date(this.getDateAsString(year, month, day));
    let daysFromJan4 = (queriedWeek.getTime() - someDateIn1CW.getTime()) / dayIn_ms;
    let weekNr = 1 + Math.round((daysFromJan4 - 3 + (someDateIn1CW.getDay() + 6)% 7 ) / 7);
    // source: https://weeknumber.com/how-to/javascript  | tested with http://www.whatweekisit.org/
    // needed a lot of refabricatoin
    return weekNr;
  }

}