import { Injectable } from '@angular/core';

@Injectable()
  // providedIn: 'root'

export class CommunicationService {
  subscribeFunctions: {subscriberId: string, subscribeFunction: Function, eventsToInformAbout: string[]}[] = []
  constructor() { }

  // cb(eventType: string, data: any)

  subscribe(subscriberUniqueId: string, subscribeFunction: Function, eventsToInformAbout?: string[]){
    if (eventsToInformAbout == undefined || eventsToInformAbout == null) eventsToInformAbout = [];
    let subscriberObject = {
      subscriberId: subscriberUniqueId,
      subscribeFunction: subscribeFunction,
      eventsToInformAbout: eventsToInformAbout
    }
    this.subscribeFunctions.push(subscriberObject);
  }

  inform(eventType: string, data: any){
    for(let subscriber of this.subscribeFunctions){
      if (this.checkIfSubscriberIsInterested(subscriber.eventsToInformAbout, eventType)){
        subscriber.subscribeFunction(eventType, data);
      }
    }
  }

  async infromAfter(eventType: string, data: any, promiseToResolve: any){    
    promiseToResolve.then(()=>{ 
      this.inform(eventType, data);
    })
  }

  informWithFeedback(eventType: string, data: any, senderId?: string){
    let wasInformationPassed = false;
    for(let subscriber of this.subscribeFunctions){
      if (this.checkIfSubscriberIsInterested(subscriber.eventsToInformAbout, eventType)){
        subscriber.subscribeFunction(eventType, data);
        wasInformationPassed = true;
      }
    }
    return wasInformationPassed;
  }

  unsubscribe(subscribersId: string){
    let subscribersIndex = this.getSubscribersIndex(subscribersId);
    this.deleteElementFromArray(this.subscribeFunctions, subscribersIndex)
  }

  getSubscribersIndex(subscribersId: string){
    let singleMatch = function(element: any, index: number){
      return element.subscriberId === subscribersId
    }
    return this.subscribeFunctions.findIndex(singleMatch)
  }

  deleteElementFromArray(array: any[], index: number) {
    array.splice(index, 1);
  }

  checkIfSubscriberIsInterested(typesOfEventsSubscriberIsIterestedIn: string[], receivedEvent: string): boolean{
    if (typesOfEventsSubscriberIsIterestedIn.length == 0) return true;
    let singleMatch = function(element: any, index: number){
      return element === receivedEvent
    }
    let indexOfReceivedEvent = typesOfEventsSubscriberIsIterestedIn.findIndex(singleMatch);
    return indexOfReceivedEvent == -1 ? false : true;
  }



}
