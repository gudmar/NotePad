import { Injectable } from '@angular/core';
import { UniqueIdProviderService } from './unique-id-provider.service';
import { NextColorGeneratorService } from './next-color-generator.service'

@Injectable({
  providedIn: 'root',
})
export class ContentManagerService {

  constructor(private idProvider: UniqueIdProviderService,
              private colorProvider: NextColorGeneratorService) { }

  getFreshDocument(){
    return `

    `
  }

  getFreshCalendar(){
    return {calendarInputs: {}}
  }
  getFreshSheets(){
    let startSheetId = this.idProvider.getUniqueId();
    let startPage = this.getFreshPage();
    return {
      sheets: {
        startSheetId: {
          bgColor: ''
        }
      }
    }
  }
  getFreshPage(){
    let startPageId = this.idProvider.getUniqueId();
    return {
      startPageId: {
        notes: {},
        bgColor: {},
        title: ''
      }
    }
  }
}
