import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DescriptorToDataService {

  constructor() { }

  getElementFromArrayById(array: any[], id: string){
    let finder = function(item: any){
      let keys: string[] = Object.keys(item)
      return keys[0] === id
    }
    let indexOfSearchedElement = array.findIndex(finder);
    if (indexOfSearchedElement == -1) return undefined;
    let elementUuid: string = Object.keys(array[indexOfSearchedElement])[0];
    return {
      uuid: elementUuid,
      content: array[indexOfSearchedElement][elementUuid]
    }
  }

  getDescriptorsId(descriptor: {uniqueId: any}){
    return Object.keys(descriptor)[0]
  }

  getDescriptorValues(descriptor: {uniqueId: any}){
    return Object.values(descriptor)[0]
  }
}
