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
    let e = !this.isLinksValid(parsedDocument.links);
    let f = !this.objectShouldContainKeysAndMightContainKeys(
      parsedDocument, ['activeSheetId', 'calendarInputs', 'sheets'],
      ['links']);
    let g = !this.keyValueShouldBeTypeOf(parsedDocument, 'activeSheetId', 'string');
    let h = !this.isValueOfKeyArray(parsedDocument, 'calendarInputs');
    let i = !this.isValueOfKeyArray(parsedDocument, 'sheets');
    let j = !this.isCalendarValid(parsedDocument.calendarInputs);
    let k = !this.isLinksValid(parsedDocument.links);
    let l = !this.isNotepadValid(parsedDocument);
    let m = !this.isValueOfKeyArray(parsedDocument, 'links');

    if (f) this.logError(`
      DocumentValidator: ${Object.keys(parsedDocument)} has keys other than 'activeSheedId', 'calendarInputs', 'sheets' or 'links`
    )
    if (b) this.logError(`DocumentValidator: ${parsedDocument.activeSheedId} is not a string`);
    if (c) this.logError(`DocumentValidator: calendarInputs is not an array:`); console.dir(parsedDocument);
    if (d) this.logError(`DocumentValidator: calendar is not valid`); console.dir(parsedDocument);
    if (e) this.logError(`DocumentValidator: links is not valid:`); console.dir(parsedDocument);
    if (g) this.logError(`DocumentValidator: activeSheetId: ${parsedDocument.activeSheedId} is not a string`);
    if (i) this.logError(`DocumentValidator: sheets is not an array:`); console.dir(parsedDocument);
    if (j) this.logError(`DocumentValidator: calendarInputs are not valid:`); console.dir(parsedDocument.calendarInputs);
    if (k) this.logError(`DocumentValidator: links is not valid:`); console.dir(parsedDocument);
    if (l) this.logError(`DocumentValidator: notepad is not valid:`); console.dir(parsedDocument);
    if (m) this.logError(`DocumentValidator: links is not an array:`); console.dir(parsedDocument);

    // debugger;
    if (!this.objectShouldContainOnlyKeys(parsedDocument, ['activeSheetId', 'calendarInputs', 'sheets'])) return false;
    if (!this.objectShouldContainKeysAndMightContainKeys(
      parsedDocument, ['activeSheetId', 'calendarInputs', 'sheets'],
      ['links']
    )) return false;
    if (!this.keyValueShouldBeTypeOf(parsedDocument, 'activeSheetId', 'string')) return false;
    if (!this.isValueOfKeyArray(parsedDocument, 'calendarInputs')) return false;
    if (!this.isValueOfKeyArray(parsedDocument, 'sheets')) return false;
    if (!this.isValueOfKeyArray(parsedDocument, 'links')) return false;
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
    if (doIdsRepete) this.logError('SheetValidator: uniqueIds repete')
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
      let a = this.objectShouldContainOnlyKeys(link, ['title', 'description','url']);
      // debugger;
      if (!this.objectShouldContainOnlyKeys(link, ['topic', 'description','link'])) return false
    }
    return true;
  }

  logError(message:string){
    console.log(`%c${this.constructor.name}: ${message}`, 'background-color: red; color:white; padding:5px;border-radius:5px');
  }

  isCalendarValid(calendar: any[]){
    if (calendar.length == 0) return true;
    for (let input of calendar){
      this.objectShouldContainOnlyKeys(input, ['entries'])
      let a = this.objectShouldNotContainKeysOtherThen(input, ['year', 'entries'])
      let c = this.objectShouldContainOnlyKeys(input, ['entries', 'year'])
      let d = this.validateCalendarYearEntry(input.entries)
      if (!a) this.logError(`CalendarValidator:  ${input} contains keys other than 'year' and 'entries'`);
      if (!c) this.logError(`CalendarValidator: ${input} contains keys other than 'year' and 'entries'`)
      if (!d) this.logError(`CalendarValidator: year entry not valid: `);
      console.dir(input.entries)
      if (!this.objectShouldNotContainKeysOtherThen(input, ['year', 'entries'])) return false;
      if (!this.objectShouldContainOnlyKeys(input, ['entries', 'year'])) return false;
      // if (!this.objectShouldContainOnlyKeys(input, ['year'])) return false;
      // if (this.objectShouldContainOnlyKeys(input, ['entries'])) {
        if (!this.validateCalendarYearEntry(input.entries)) return false;
      // }

    }
    let uniqueIdArray = this.getArrayOfAllPropertyOccurenceInGetericObject_nested(calendar, 'uniqueId');
    let doIdsRepete = this.hasStringArrayRepetingValues(uniqueIdArray);
    if (doIdsRepete) this.logError('CalendarValidator: uniqeKeys repete')
    if (doIdsRepete) return false;
    return true;
  }

  validateCalendarYearEntry(arrayOfEntries: any){
    if (arrayOfEntries.length == 0) return true;
    for (let input of arrayOfEntries){
      // input = Object.values(input)[0]
      let a = this.objectShouldNotContainKeysOtherThen(input, ['month', 'entries']);
      // let b = this.objectShouldContainOnlyKeys(input, ['month']);
      // let c = this.objectShouldContainOnlyKeys(input, ['entries'])
      let e = this.objectShouldContainOnlyKeys(input, ['month', 'entries'])
      let d:boolean = true;
      if (e) {
        d = this.validateCalendarMonthEntry(input.entries)
      }
      if (!e) this.logError(`YearValidator: ${input} has keys other than 'month', 'entries'`)
      if (!d) this.logError(`YearValidator: Month entries not valid:`)
      console.dir(input.entries)
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
      let c: boolean = true;
      if (b) {
        c = this.validateCalendarDayEntries(input.entries)
      }
      if (!b) this.logError(`MonthEntryValidator: ${input} contains keys other than 'day', 'entries'`);
      if (!c) this.logError(`MonthEntryValidator: Day entries is not valid:`);
      console.dir(input.entries);
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
  
      if (!b) this.logError(`
        DayEntryValidator: ${entry} contains keys other than 'hours', 'minutes', 'duration', 'summary', 'uniqueId', 'description'`
      );
      if (!c) {this.logError(`DayEntryValidator: hours: ${entry.hours} is not a number`);console.dir(entry);}
      if (!d) {this.logError(`DayEntryValidator: minutes: ${entry.minutes} is not a number`);console.dir(entry);}
      if (!e) {this.logError(`DayEntryValidator: duration: ${entry.duration} is not a number`);console.dir(entry);}
      if (!f) {this.logError(`DayEntryValidator: summary: ${entry.summary} is not a string`);console.dir(entry);}
      if (!g) {this.logError(`DayEntryValidator: description: ${entry.description} is not a stirng`);console.dir(entry);}
      if (!h) {this.logError(`DayEntryValidator: uniqueId: ${entry.uniqueId} is not a stirng`);console.dir(entry);}
      if (i)  {this.logError(`DayEntryValidator: hours:  ${entry.hours} is > 24 or < 0`);console.dir(entry);}
      if (j)  {this.logError(`DayEntryValidator: minutes: ${entry.minutes} is > 59 or < 0`);console.dir(entry);}
      if (k)  {this.logError(`DayEntryValidator: summary: ${entry.summary} length of summary is > 50`);console.dir(entry);}


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
  let that = this;
  let countElements = function(element: string, array: string[]){
    let counter = 0;
    for (let item of array){
      if (item === element) {
        counter++; 
        if (counter > 1) that.logError(`Ids repete: ${item}`)
      }
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
