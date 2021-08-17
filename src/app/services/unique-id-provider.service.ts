import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UniqueIdProviderService {
  uuidsGeneratedSoFar: string[] = [];
  constructor() { }

  checkIfUUIDWasAlreadyGenerated(elementToCheck: string){
    let findingFunction = function(element: string){ return element === elementToCheck}
    return (this.uuidsGeneratedSoFar.find(findingFunction) == undefined) ? true : false;
  }

  getGoodEnoughId(){
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
    // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
  }

  getUniqueId(): string{
    let tempId = '';
    if (this.uuidsGeneratedSoFar.length > 1000000000) return 'xxxxxxxx'; 
    // should never happen, there is potential infinite loop, that will occure if too many IDs were generated, but number is huge
    while (tempId === '' && this.checkIfUUIDWasAlreadyGenerated(tempId)){
      tempId = this.getGoodEnoughId();
    }
    return tempId
  }
}
