import { Injectable } from '@angular/core';
import { CommunicationService } from './communication.service';

@Injectable()

export class AppMenuOperationsService {

  constructor(private messenger: CommunicationService) { }

  saveToAFile(){
    this.messenger.inform('saveToFile', '')
  }

  getNewPage(){
    this.messenger.inform('loadFreshDocument', '');
  }

  openMemoryManager(mode: 'save' | 'load'){
    if (mode == "save") this.messenger.inform('displaySaveWindow', '')
    if (mode == "load") this.messenger.inform('displayLoadWindow', '')
  }

  saveToLastUsedKey(){
    this.messenger.inform('saveToLastUsedKey', '')
  }

  addNextSheet(){
    this.messenger.inform('addNextSheet', {after: 'last'})
  }

  switchToCalendar(){
    this.messenger.inform('switchToCalendar', '');
  }

  switchToNotepad(){
    this.messenger.inform('switchToNotes', '');
  }

  displayHelp(){

  }
}
