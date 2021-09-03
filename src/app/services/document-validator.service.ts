import { Injectable } from '@angular/core';
import { ConstantPool } from '@angular/compiler';
import { ConcatSource } from 'webpack-sources';

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
      this.objectShouldContainKeys(input, ['entries'])
      if (!this.objectShouldNotContainKeysOtherThen(input, ['year', 'entries'])) return false;
      if (!this.objectShouldContainKeys(input, ['year'])) return false;
      if (this.objectShouldContainKeys(input, ['entries'])) {
        if (!this.validateCalendarYearEntry(input.entries)) return false;
      }

    }
    let uniqueIdArray = this.getArrayOfAllPropertyOccurenceInGetericObject_nested(calendar, 'uniqueId');
    let doIdsRepete = this.hasStringArrayRepetingValues(uniqueIdArray);
    if (doIdsRepete) return false;
    return true;
  }

  validateCalendarYearEntry(arrayOfEntries: any){
    if (arrayOfEntries.length == 0) return true;
    for (let input of arrayOfEntries){
      input = Object.values(input)[0]
      if (!this.objectShouldNotContainKeysOtherThen(input, ['month', 'entries'])) return false;
      if (!this.objectShouldContainKeys(input, ['month'])) return false;
      if (this.objectShouldContainKeys(input, ['entries'])) {
        if (!this.validateCalendarMonthEntry(input.entries)) return false;
      }
    }
    return true;
  }

  validateCalendarMonthEntry(object: any){
    if (object.length == 0) return true;
    for (let input of object){
      if (!this.objectShouldNotContainKeysOtherThen(input, ['day', 'entries'])) return false;
      if (!this.objectShouldContainKeys(input, ['day'])) return false;
      if (this.objectShouldContainKeys(input, ['entries'])) {
        if (!this.validateCalendarDayEntries(input.entries)) return false;
      }
    }
    return true;
  }

  validateCalendarDayEntries(dayEntries: any[]){
    for(let entry of dayEntries){
      if (!this.objectShouldContainKeys(entry, 
        ['hours', 'minutes', 'duration', 'summary','uniqueId', 'description'])) return false;
      if (!this.objectShouldNotContainKeysOtherThen(entry, 
        ['hours', 'minutes', 'duration', 'summary','uniqueId', 'description'])) return false  
      if (!this.keyValueShouldBeTypeOf(entry, 'hours', 'number')) return false;
      if (!this.keyValueShouldBeTypeOf(entry, 'minutes', 'number')) return false;
      if (!this.keyValueShouldBeTypeOf(entry, 'duration', 'number')) return false;
      if (!this.keyValueShouldBeTypeOf(entry, 'summary', 'string')) return false;
      if (!this.keyValueShouldBeTypeOf(entry, 'description', 'string')) return false;
      if (!this.keyValueShouldBeTypeOf(entry, 'uniqueId', 'string')) return false;
      if (entry.hours > 24 || entry.hours < 0) return false;
      if (entry.minutes < 0 || entry.minutes > 59) return false;
      if (entry.summary.length > 50) return false;
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

hasStringArrayRepetingValues(arr: string[]){
  let countElements = function(element: string, array: string[]){
    let counter = 0;
    for (let item of array){
      if (item === element) counter++;
    }
    return counter;
  }
  for (let item of arr) {
    if (countElements(item, arr) > 1) return true;
  }
  return false;
}

getArrayOfAllPropertyOccurenceInGetericObject_nested(object: any, queriedPropertyKey: string){
  // for example get array of all uniqueId to see if it does not repete
  let arr: any[] = [];
  if (Array.isArray(object)) arr = arr.concat(this.getArrayOfAllPropertyOccurenceInArray_nested(object, queriedPropertyKey));
  else if (typeof(object) == 'object') arr = arr.concat(this.getArrayOfAllPropertyOccurenceInObject_nested(object, queriedPropertyKey));
  // debugger
  return arr;
}

getArrayOfAllPropertyOccurenceInArray_nested(objectAsArray: any[], queriedPropertyKey: string){
  let arr: any[] = [];
  for (let item of objectAsArray){
    if (typeof(item) == 'object'){
      arr = arr.concat(this.getArrayOfAllPropertyOccurenceInGetericObject_nested(item, queriedPropertyKey))
    }
  }
  return arr;
}

getArrayOfAllPropertyOccurenceInObject_nested(object:any, queriedPropertyKey:string){
  let arr: any = [];
  if (typeof(object) == 'object'){
    if (Array.isArray(object)) {
      arr = arr.concat(this.getArrayOfAllPropertyOccurenceInArray_nested)
      console.log('Is array')
    }
    else {
      let keys = Object.keys(object);
      // debugger
      for(let key of keys){
        let value = object[key];
        console.log(value)
        console.log(typeof(value))
        if (key == queriedPropertyKey) arr.push(value)
        else if (typeof(value) == 'object'){
          let deb = this.getArrayOfAllPropertyOccurenceInGetericObject_nested(value, queriedPropertyKey);
          console.log(deb)
          arr = arr.concat(deb)
        }
      }
    }
  }
  return arr
}

}
