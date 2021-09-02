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

  isCalendarValid(calendarSubobject: any[]){
    // if (this.eachArrayElementShouldContainKeys(calendarSubobject, 'entries'))
    return null;
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
