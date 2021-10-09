import { Injectable } from '@angular/core';
import { ConstantPool } from '@angular/compiler';
import { ConcatSource } from 'webpack-sources';
import { link } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class DocumentValidatorService {

  constructor() { }

  validateAsString(stringifiedDocumnet: string){
    let parsedDocument = this.tryToParseContent(stringifiedDocumnet);
    if (parsedDocument == null) return false;
    
    let a = !this.objectShouldContainOnlyKeys(parsedDocument, ['activeSheetId', 'calendarInputs', 'sheets']);
    let b = !this.keyValueShouldBeTypeOf(parsedDocument, 'activeSheetId', 'string');
    let c = !this.isValueOfKeyArray(parsedDocument, 'calendarInputs');
    let d = !this.isCalendarValid(parsedDocument.calendarInputs);
    // debugger;
    if (!this.objectShouldContainOnlyKeys(parsedDocument, ['activeSheetId', 'calendarInputs', 'sheets'])) return false;
    if (!this.objectShouldContainKeysAndMightContainKeys(
      parsedDocument, ['activeSheetId', 'calendarInputs', 'sheets'],
      ['links']
    )) return false;
    if (!this.keyValueShouldBeTypeOf(parsedDocument, 'activeSheetId', 'string')) return false;
    if (!this.isValueOfKeyArray(parsedDocument, 'calendarInputs')) return false;
    if (!this.isValueOfKeyArray(parsedDocument, 'sheets')) return false;
    if (!this.isCalendarValid(parsedDocument.calendarInputs)) return false;
    // !!! No ! was here !!
    if (!this.isLinksValid(parsedDocument.links)) return false
    if (!this.isNotepadValid(parsedDocument)) return false;
    return true;
  }

  isNotepadValid(parsedDocument: any){
    if(parsedDocument.activeSheetId.length == 0) return false;
    if (parsedDocument.sheets.length == 0) return true;
    let pagesHaveUniqueId = this.doPageObjectsHaveUniqueId(parsedDocument.sheets)
    if (!pagesHaveUniqueId) return false;
    return this.validateSheetObjects(parsedDocument.sheets)
  }

  validateSheetObjects(sheetsSubobject:any[]){

    for (let sheet of sheetsSubobject){
      sheet = Object.values(sheet)[0]
      if(!this.objectShouldContainOnlyKeys(sheet, ['bgColor', 'originalColor', 'pages','startPageId','title'])) return false;
      if (this.propsShouldNotBeEmpty(sheetsSubobject, ['bgColor','originalColor','pages','startPageId','title'])) return false;
      if (!this.arePageDescriptorsValid(sheet.pages)) return false;
    }

    let sheetIds = this.getKeysOfObjectsBeingElementsOfArray(sheetsSubobject)
    let doSheetIdsRepete = this.hasStringArrayRepetingValues(sheetIds);
    if (doSheetIdsRepete) return false;


    let uniqueIdArray = this.getArrayOfAllPropertyOccurenceInGetericObject_nested(sheetsSubobject, 'uniqueId');
    let doIdsRepete = this.hasStringArrayRepetingValues(uniqueIdArray);
    if (doIdsRepete) return false;
    return true;
  }

  doPageObjectsHaveUniqueId(sheetArray:any[]){
    let allPageIds:any[] = [];
    for(let sheet in sheetArray){
      // debugger
      let internalObj:any = Object.values(sheetArray[sheet])[0];
      let pages: any = internalObj.pages;
      // debugger
      for (let pg of pages){
        allPageIds = allPageIds.concat(Object.keys(pg))
      }
      // let pages:any = internalObj.pages;
      // pages = Object.values(sheetArray[sheet])[0];
      // debugger
      // allPageIds = allPageIds.concat(this.getKeysOfObjectsBeingElementsOfArray(internalObj))
    }
    let doPagesHaveRepetingValues = this.hasStringArrayRepetingValues(allPageIds);
    // debugger
    return !doPagesHaveRepetingValues;
  }

  arePageDescriptorsValid(pageDescriptorArray: any[]){
    for (let page of pageDescriptorArray){
      if (!this.isSinglePageDescriptorValid(page)) return false;
    }
    return true;
  }

  isSinglePageDescriptorValid(pageDescriptor: any){
    pageDescriptor = Object.values(pageDescriptor)[0];
    if(!this.objectShouldContainOnlyKeys(pageDescriptor, ['bgColor', 'notes', 'originalColor', 'title'])) return false;
    if(!this.propsShouldNotBeEmpty(pageDescriptor, ['bgColor', 'originalColor'])) return false;
    if(!this.validateNoteDescriptors(pageDescriptor.notes)) return false;
    return true;
  }

  validateNoteDescriptors(noteDescriptorArray: any[]){
    for(let note of noteDescriptorArray){
      if (!this.objectShouldContainOnlyKeys(note, 
        ['uniqueId','initialWidth','initialHeight','initialTop','initialLeft','content'])) return false;
      if (!this.propsShouldNotBeEmpty(note, 
        ['uniqueId','initialWidth','initialHeight','initialTop','initialLeft'])) return false;
      if (typeof(note.content) != 'string') return false;
      if (typeof(note.initialHeight) != 'number') return false;
      if (typeof(note.initialLeft) != 'number' ) return false;
      if (typeof(note.initialTop) != 'number' ) return false;
      if (typeof(note.initialWidth) != 'number' ) return false;
      if (typeof(note.uniqueId) != 'string') return false;
    }
    return true;
  }

  getKeysOfObjectsBeingElementsOfArray(arrayOfObjects:any[]){
    let keys:string[] = [];
    for(let item of arrayOfObjects){
      let itemKeys = Object.keys(item);
      keys = keys.concat(itemKeys)
    }
    return keys;
  }

  propsShouldNotBeEmpty(object: any, propsArray: string[]){
    let isSinglePropEmpty = function(prop: string){
      let value = object[prop];
      if (typeof(value) == 'string' && value.length == 0) return true;
      if (Array.isArray(value) && value.length == 0) return true;
      if (value == undefined || value == null) return true;
      return false;
    }
    for (let prop of propsArray) {
      if (isSinglePropEmpty(prop)) return false;
    }
    return true;
  }

  isLinksValid(links: any[]){
    if (links == undefined) return true;
    if (!Array.isArray(links)) return false;
    if (links.length == 0) return true;
    for (let link of links){
      let keys = Object.keys(link);
      if (!this.objectShouldContainOnlyKeys(link, ['title', 'description','url'])) return false
    }
    return true;
  }

  isCalendarValid(calendar: any[]){
    if (calendar.length == 0) return true;
    for (let input of calendar){
      this.objectShouldContainOnlyKeys(input, ['entries'])
      let a = this.objectShouldNotContainKeysOtherThen(input, ['year', 'entries'])
      // let b = this.objectShouldContainOnlyKeys(input, ['year'])
      // let c = this.objectShouldContainOnlyKeys(input, ['entries'])
      let c = this.objectShouldContainOnlyKeys(input, ['entries', 'year'])
      let d = this.validateCalendarYearEntry(input.entries)
      // debugger
      if (!this.objectShouldNotContainKeysOtherThen(input, ['year', 'entries'])) return false;
      if (!this.objectShouldContainOnlyKeys(input, ['entries', 'year'])) return false;
      // if (!this.objectShouldContainOnlyKeys(input, ['year'])) return false;
      // if (this.objectShouldContainOnlyKeys(input, ['entries'])) {
        if (!this.validateCalendarYearEntry(input.entries)) return false;
      // }

    }
    let uniqueIdArray = this.getArrayOfAllPropertyOccurenceInGetericObject_nested(calendar, 'uniqueId');
    let doIdsRepete = this.hasStringArrayRepetingValues(uniqueIdArray);
    if (doIdsRepete) return false;
    return true;
  }

  validateCalendarYearEntry(arrayOfEntries: any){
    if (arrayOfEntries.length == 0) return true;
    for (let input of arrayOfEntries){
      // input = Object.values(input)[0]
      let a = this.objectShouldNotContainKeysOtherThen(input, ['month', 'entries']);
      let b = this.objectShouldContainOnlyKeys(input, ['month']);
      let c = this.objectShouldContainOnlyKeys(input, ['entries'])
      let e = this.objectShouldContainOnlyKeys(input, ['month', 'entries'])
      let d:boolean;
      if (c) {
        d = this.validateCalendarMonthEntry(input.entries)
      }
      // debugger;
      if (!this.objectShouldNotContainKeysOtherThen(input, ['month', 'entries'])) return false;
      // if (!this.objectShouldContainOnlyKeys(input, ['month'])) return false;
      if (!this.objectShouldContainOnlyKeys(input, ['month', 'entries'])) return false;
      // if (this.objectShouldContainOnlyKeys(input, ['entries'])) {
        if (!this.validateCalendarMonthEntry(input.entries)) return false;
      // }
    }
    return true;
  }

  validateCalendarMonthEntry(object: any){
    if (object.length == 0) return true;
    for (let input of object){
      let a = this.objectShouldNotContainKeysOtherThen(input, ['day', 'entries'])
      let b = this.objectShouldContainOnlyKeys(input, ['day', 'entries'])
      let c: boolean;
      if (b) {
        c = this.validateCalendarDayEntries(input.entries)
      }
      // debugger
      if (!this.objectShouldNotContainKeysOtherThen(input, ['day', 'entries'])) return false;
      if (!this.objectShouldContainOnlyKeys(input, ['day', 'entries'])) return false;
      // if (!this.objectShouldContainOnlyKeys(input, ['day'])) return false;
      // if (this.objectShouldContainOnlyKeys(input, ['entries'])) {
        if (!this.validateCalendarDayEntries(input.entries)) return false;
      // }
    }
    return true;
  }

  validateCalendarDayEntries(dayEntries: any[]){
    for(let entry of dayEntries){
      let a = this.objectShouldContainOnlyKeys(entry, 
        ['hours', 'minutes', 'duration', 'summary','uniqueId', 'description']);
      let b = this.objectShouldNotContainKeysOtherThen(entry, 
        ['hours', 'minutes', 'duration', 'summary','uniqueId', 'description']);
      let c = this.keyValueShouldBeTypeOf(entry, 'hours', 'number');
      let d = this.keyValueShouldBeTypeOf(entry, 'minutes', 'number');
      let e = this.keyValueShouldBeTypeOf(entry, 'duration', 'number');
      let f = this.keyValueShouldBeTypeOf(entry, 'summary', 'string');
      let g = this.keyValueShouldBeTypeOf(entry, 'description', 'string');
      let h = this.keyValueShouldBeTypeOf(entry, 'uniqueId', 'string');
      let i = (entry.hours > 24 || entry.hours < 0);
      let j = (entry.minutes < 0 || entry.minutes > 59);
      let k = (entry.summary.length > 50);
      // debugger;
  



      if (!this.objectShouldContainOnlyKeys(entry, 
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
      if (!this.objectShouldContainOnlyKeys(arrElement, listOfKeys)) return false;
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

  objectShouldContainKeysAndMightContainKeys(dataAsObject:any, mandatoryKeys:string[], optionalKeys:string[]){
    let objectKeys  = Object.keys(dataAsObject);
    let nrOfMandatoryMatches = 0;
    let nrOfOptionalMatches = 0;
    let allKeys = [...mandatoryKeys, ...optionalKeys];
    for (let key of mandatoryKeys){
      if (this.arrayShouldContainStringElement(objectKeys, key)) nrOfMandatoryMatches++;
    }
    if (nrOfMandatoryMatches != mandatoryKeys.length) return false;
    for (let key of objectKeys){
      if (!this.arrayShouldContainStringElement(allKeys, key)) return false;
    }
    return true;
  }

  objectShouldContainOnlyKeys(dataAsObject: any, keys: string[]){
    let objectKeys = Object.keys(dataAsObject);
    let nrOfMatches = 0;
    for (let key of keys){
      if (this.arrayShouldContainStringElement(objectKeys, key)) nrOfMatches++;
    }
    // console.log('sholdContainKeys')
    // console.log(nrOfMatches)
    // console.log(keys.length)
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
    }
    else {
      let keys = Object.keys(object);
      for(let key of keys){
        let value = object[key];
        if (key == queriedPropertyKey) arr.push(value)
        else if (typeof(value) == 'object'){
          let deb = this.getArrayOfAllPropertyOccurenceInGetericObject_nested(value, queriedPropertyKey);
          arr = arr.concat(deb)
        }
      }
    }
  }
  return arr
}

}
