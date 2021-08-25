import { Injectable } from '@angular/core';
import { serialize } from 'v8';
import { ENETRESET } from 'constants';

@Injectable({
  providedIn: 'root'
})
export class EventManagerService {

  constructor() { }


  getCalendarSingleEntryAsObject(hours: number, 
    minutes: number, 
    duration: number, 
    summary: string, 
    description: string,
    uniqueId: string
  ){
    return{
      hours: hours, 
      minutes: minutes, 
      duration: duration, 
      summary: summary, 
      description: description, 
      uniqueId: uniqueId
    }
  }
  getCalendarDayEntryAsObject(day: number, entries: any[]){
    return {
      day: day, 
      entries: entries
    }
  }
  getCalendarMonthEntryAsObject(month: number, entries: any[]){
    return {
      month: month,
      entries: entries
    }
  }
  getCalendarYearEntryAsObject(year: number, entries: any[]){
    return {
      year: year,
      entries: entries
    }
  }

  fetchDayEvents(year: number, 
    month: number, 
    day: number, 
    calendarEvents:  any[] // [{year: number, entries: [{month: number, entries: any[]}]}]
  ){
    let desiredMonthDescriptor = this.fetchMonthEvents(year, month, calendarEvents);
    return this.fetchFromCallendarArray('day', desiredMonthDescriptor.entries, day)
  }

  fetchMonthEvents(year: number, 
    month: number, 
    calendarEvents: any[] // [{year: number, entries: [{month: number, entries: any[]}]}]
  ){
    let desiredYearEvents = this.fetchYearEvents(year, calendarEvents);
    return this.fetchFromCallendarArray('month', desiredYearEvents.entries, month)
  }

  fetchYearEvents(year: number, 
    calendarEvents: any[] // [{year: number, entries: [{month: number, entries: any[]}]}]
  ){
    // debugger;
    return this.fetchFromCallendarArray('year', calendarEvents, year)
  }

  fetchFromCallendarArray(keyName: string, parentObject: any, searchedValue: number){
    let singleMatch = function(element: any) {return element[keyName] === searchedValue}
    let entries = parentObject//.entries
    // debugger
    let searchedIndex = entries.findIndex(singleMatch);
    return entries[searchedIndex]
  }
  

  addCalendarSingleEntry(){}


  // [
  //   {year: 2021,
  //    entries: [
  //       {month: 0,
  //         entries: {
  //           day: 10,
  //           entries: [
  //             {hours: 
  //              minutes:
  //               duration:
  //               summary:
  //               description
  //             }
  //           ]
  //         }
  //       }
  //     ]
  //   }
  // ]
}
