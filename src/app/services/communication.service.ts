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
    console.log(`comonent wit id ${subscriberUniqueId} subscribed`)
    console.log(this.subscribeFunctions)
  }

  inform(eventType: string, data: any){
    console.log('Informing about ' + eventType)
    console.log(this.subscribeFunctions)
    for(let subscriber of this.subscribeFunctions){
      if (this.checkIfSubscriberIsInterested(subscriber.eventsToInformAbout, eventType)){
        console.log(`subscriber ${subscriber.subscriberId} informed about ${eventType}`)
        subscriber.subscribeFunction(eventType, data);
      }
    }
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
    // debugger
    return indexOfReceivedEvent == -1 ? false : true;
  }



}
