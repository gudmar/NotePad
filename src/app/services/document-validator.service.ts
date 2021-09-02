import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentValidatorService {

  constructor() { }

  validateAsString(stringifiedDocumnet: string){
    let parsedDocument = this.tryToParseContent(stringifiedDocumnet);
    if (parsedDocument == null) return null;
    if (!this.objectShouldContainKeys(parsedDocument, ['activeSheetId', 'calendarInputs', 'sheets'])) return null;
    if (!this.keyValueShouldBeTypeOf(parsedDocument, 'activeSheetId', 'string')) return null;
    if (!this.isValueOfKeyArray(parsedDocument, 'calendarInputs')) return null;
    if (!this.isValueOfKeyArray(parsedDocument, 'sheets')) return null;
    if (!this.isCalendarValid(parsedDocument.calendarInputs)) return null;

    return parsedDocument;
  }

  isCalendarValid(calendar: any[]){
    if (calendar.length == 0) return true;
    for (let input of calendar){
      let itemKeys = Object.keys(input);
      if (!this.objectShouldNotContainKeysOtherThen(input, ['year', 'entries'])) return false;
      if (!this.objectShouldContainKeys(itemKeys, ['year'])) return false;
      if (this.objectShouldContainKeys(itemKeys, ['entries'])) {
        if (!this.validateCalendarYearEntry(itemKeys.entries)) return false;
      }
    }
    return true;
  }

  validateCalendarYearEntry(object: any){
    if (object.length == 0) return true;
    for (let input of object){
      let itemKeys = Object.keys(input);
      if (!this.objectShouldNotContainKeysOtherThen(input, ['month', 'entries'])) return false;
      if (!this.objectShouldContainKeys(itemKeys, ['month'])) return false;
      if (this.objectShouldContainKeys(itemKeys, ['entries'])) {
        if (!this.validateCalendarMonthEntry(itemKeys.entries)) return false;
      }
    }
    return true;
  }

  validateCalendarMonthEntry(object: any){
    if (object.length == 0) return true;
    for (let input of object){
      let itemKeys = Object.keys(input);
      if (!this.objectShouldNotContainKeysOtherThen(input, ['day', 'entries'])) return false;
      if (!this.objectShouldContainKeys(itemKeys, ['day'])) return false;
      if (this.objectShouldContainKeys(itemKeys, ['entries'])) {
        if (!this.validateCalendarDayEntry(itemKeys.entries)) return false;
      }
    }
    return true;
  }

  validateCalendarDayEntry(dayEntries: any[]){
    if (!this.objectShouldContainKeys(dayEntries, 
      ['hours', 'minutes', 'duration', 'summary','uniqueId', 'description'])) return false;
    if (!this.objectShouldNotContainKeysOtherThen(dayEntries, 
      ['hours', 'minutes', 'duration', 'summary','uniqueId', 'description'])) return false
    for(let entry of dayEntries){
      if (!this.keyValueShouldBeTypeOf(entry, 'hours', 'number')) return false;
      if (!this.keyValueShouldBeTypeOf(entry, 'minutes', 'number')) return false;
      if (!this.keyValueShouldBeTypeOf(entry, 'duration', 'number')) return false;
      if (!this.keyValueShouldBeTypeOf(entry, 'summary', 'string')) return false;
      if (!this.keyValueShouldBeTypeOf(entry, 'description', 'string')) return false;
      if (!this.keyValueShouldBeTypeOf(entry, 'uniqueId', 'string')) return false;
    }
    return true;
  }



  objectShouldNotContainKeysOtherThen(dataAsObject: any, listOfKeys: string[]){
    // true if object does not contain other keys
    let objectKeys = Object.keys(dataAsObject);
    if (listOfKeys.length < objectKeys.length) return false;
    let nrOfMatches = 0;
    for (let key of objectKeys){
      if (!this.arrayShouldContainStringElement(listOfKeys, key)) return false;
    }
    return true;
  }

  eachArrayElementShouldContainKeys(arr: any[], listOfKeys: string[]){
    for (let arrElement of arr) {
      if (!this.objectShouldContainKeys(arrElement, listOfKeys)) return false;
    }
    return true;
  }

  isValueOfKeyArray(object:any, key:string){
    let value = object[key];
    return Array.isArray(value);
  }

  keyValueShouldBeTypeOf(object:any, key:string, desiredValueType:string):boolean{
    let value = object[key];
    return typeof(value) == desiredValueType;
  }

  tryToParseContent(data: string){
    let output: any;
    try{
      output = JSON.parse(data)
    } catch (e){
      return null
    }
    return output;
  }

  objectShouldContainKeys(dataAsObject: any, keys: string[]){
    let objectKeys = Object.keys(dataAsObject);
    let nrOfMatches = 0;
    for (let key of keys){
      if (this.arrayShouldContainStringElement(objectKeys, key)) nrOfMatches++;
    }
    return nrOfMatches == keys.length;
  }

  arrayShouldContainStringElement(array: any[], searchedElement: any){
    return array.findIndex((e:string)=>{return e == searchedElement})==-1?false:true;
  }

}
