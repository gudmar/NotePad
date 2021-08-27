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
    if (calendarEvents.length == 0) return [];
    // debugger
    let desiredMonthDescriptor = this.fetchMonthEvents(year, month, calendarEvents);
    if (desiredMonthDescriptor == undefined) return []
    return this.fetchFromCallendarArray('day', desiredMonthDescriptor.entries, day)
  }

  fetchMonthEvents(year: number, 
    month: number, 
    calendarEvents: any[] // [{year: number, entries: [{month: number, entries: any[]}]}]
  ){
    if (calendarEvents.length == 0) return [];
    let desiredYearEvents = this.fetchYearEvents(year, calendarEvents);
    if (desiredYearEvents == undefined) return []
    return this.fetchFromCallendarArray('month', desiredYearEvents.entries, month)
  }

  fetchYearEvents(year: number, 
    calendarEvents: any[] // [{year: number, entries: [{month: number, entries: any[]}]}]
  ){
    return this.fetchFromCallendarArray('year', calendarEvents, year)
  }

  fetchFromCallendarArray(keyName: string, parentObject: any, searchedValue: number){
    if (parentObject.length == 0) return [];
    let singleMatch = function(element: any) {return element[keyName] === searchedValue}
    let entries = parentObject
    let searchedIndex = entries.findIndex(singleMatch);
    let searchedEntries = entries[searchedIndex]
    return searchedEntries == undefined ? [] : searchedEntries;
  }

  moveEvent(fromDate: any, toDate: any, eventObj: any, eventId: string){
    let executionStatus = {newDayWasCreated: false, newMonthWasCreated: false, newYearWasCreated: false}
    let eventsFromStartDay = this.fetchDayEvents(fromDate.year, fromDate.month, fromDate.day, eventObj).entries;
    let eventsFromEndDay = this.fetchDayEvents(toDate.year, toDate.month, toDate.day, eventObj).entries;
    let e = this.fetchDayEvents(toDate.year, toDate.month, toDate.day, eventObj)
    let targetEventId = this.getIndexOfElemetnInArray(eventsFromStartDay, 'uniqueId', eventId);
    let copyOfEvent = Object.assign({}, eventsFromStartDay[targetEventId]);
    eventsFromStartDay.splice(targetEventId, 1);
    if (typeof(eventsFromEndDay) == "function") {
      executionStatus = this.addEmptyEventsObjectToDay(toDate, eventObj)
      eventsFromEndDay = this.fetchDayEvents(toDate.year, toDate.month, toDate.day, eventObj).entries
    }
    eventsFromEndDay.push(copyOfEvent)
    return executionStatus
  }

  addEmptyEventsObjectToDay(date: any, eventObj: any){
    let currentObj = eventObj;
    let executionStatus = {newDayWasCreated: false, newYearWasCreated: false, newMonthWasCreated: false}
    if (this.fetchYearEvents(date.year, currentObj).length == 0) {
      
      eventObj.push(this.getCalendarYearEntryAsObject(date.year, []))
      executionStatus.newYearWasCreated = true;
    }
    currentObj = this.fetchYearEvents(date.year, currentObj)
    if (this.fetchMonthEvents(date.year, date.month, eventObj).length == 0){
      currentObj.entries.push(this.getCalendarMonthEntryAsObject(date.month, []))
      executionStatus.newMonthWasCreated = true;
    }
    currentObj = this.fetchMonthEvents(date.year, date.month, eventObj)
    if (this.fetchDayEvents(date.year, date.matchKey, date.day, eventObj).length == 0){
      currentObj.entries.push(this.getCalendarDayEntryAsObject(date.day, []));
      executionStatus.newDayWasCreated = true;
    }
    return executionStatus;
  }

  addFirstTask(date: any, eventObj:any, newEventUUID: string){
    let executionStatus = {newDayWasCreated: false, newMonthWasCreated: false, newYearWasCreated: false}
    let eventsFromEndDay = this.fetchDayEvents(date.year, date.month, date.day, eventObj).entries;
    if (typeof(eventsFromEndDay) == "function") {
      executionStatus = this.addEmptyEventsObjectToDay(date, eventObj)
      eventsFromEndDay = this.fetchDayEvents(date.year, date.month, date.day, eventObj).entries
    }
    eventsFromEndDay.push({
      hours: 0, minutes: 0, duration: 0, summary: '', uniqueId: newEventUUID, description: ''
    })
    return executionStatus
  }

  getIndexOfElemetnInArray(array: any[], matchKey: string, value: any){
    let singleMatch = function(element: any) { return element[matchKey] == value; }
    // debugger
    return array.findIndex(singleMatch);
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
