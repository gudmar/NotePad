import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetActiveNoteDataService {

  constructor() { }

  getActiveNoteData(communicatorSingletonInstance: any){
    let communicator = communicatorSingletonInstance;
    let uniqueId = 'getActiveNoteDataServiceId'
    let noteData:any = null;
    let messageHandle = function(eventType: string, data: any){noteData = data}
    communicator.subscribe(uniqueId, messageHandle, ['activeNoteResponse']);
    let isThereAnActiveNote = communicator.informWithFeedback('ifThereIsAnyActiveNotePleaseTransmitData', '');
    communicator.unsubscribe(uniqueId);
    return noteData;
  }
}
