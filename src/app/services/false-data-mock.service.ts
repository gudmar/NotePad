import { Injectable } from '@angular/core';
import { UniqueIdProviderService } from './unique-id-provider.service';
import { NextColorGeneratorService } from './next-color-generator.service'
import { EventManagerService } from '../calendar/services/event-manager.service'
import { start } from 'repl';

@Injectable({
  providedIn: 'root',
})
export class FalseDataMockService {

  constructor(private idProvider: UniqueIdProviderService,
              private colorProvider: NextColorGeneratorService) { }


  getListOfPagesForSheet(sheetId: string){
    let sheetArray = this.getDocumentFromMemory().sheets;
    return this.getSheetById(sheetArray, sheetId).pages;
  }
  
  getListOfSheetsFromMemory(){
    return this.getDocumentFromMemory().sheets
  }

  getDocumentFromMemory(){
    return this.getMockDocumentContent(10, 6, 4);
  }

  getSheetById(arrayOfSheetDescriptors: any[], id: string){
    let that = this;
    let finder = function(item:any){return item.id === id}
    let foundPage = arrayOfSheetDescriptors.find(finder);
    // if (foundPage == undefined) debugger
    return foundPage != undefined ? arrayOfSheetDescriptors[foundPage]['uniqueId'] : undefined;
  }

  getMockDocumentContent(nrOfSheets: number, nrOfPages: number, numberOfNotes: number){
    this.colorProvider.restart();
    let colors:string[] = [];
    let titles: string[] = [];
    let that = this;
    let noteSizes = [[200, 100], [120, 220], [50, 60], [60, 50], [80, 90]]
    let notePositions = [[100, 100], [220, 120], [100, 200], [200, 250], [80, 400]]

    let getArrayOfNotes = function(){
      let notes: any[] = [];
      for (let i = 0; i < numberOfNotes; i++){
         let note = that.getNote(noteSizes[i][0], noteSizes[i][1], notePositions[i][0], notePositions[i][1], noteContent);
         notes.push(note)
      }
      return notes;
    }

    let getColors = function(nr: number) {
      for (let i = 0; i < Math.max(nrOfPages, nrOfSheets); i++){
        colors.push(that.colorProvider.getNextColor())
      }
    }
    let getTitles = function(nr: number) {
      for (let i = 0; i < Math.max(nrOfPages, nrOfSheets); i++){
        titles.push(`title ${i}`)
      }
    }
    let noteContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper, augue sit amet tempor imperdiet, .'
    let getPages = function(nr: number){
      getColors(Math.max(nrOfPages, nrOfSheets))
      getTitles(Math.max(nrOfPages, nrOfSheets))
      
      let pages = [];
      for (let i = 0; i < nrOfPages; i++){
        let arrayOfNotes = getArrayOfNotes();
        pages.push(that.getPage(colors[i], titles[i], arrayOfNotes))
      }
      return pages;
    }
    let createSheets = function(){
      let sheets:any = [];
      for (let i = 0; i < nrOfSheets; i++){
        let pages = getPages(5);
        sheets.push(that.getSheet(colors[i], titles[i], pages, Object.keys(pages[1])[0]))
      }
      return sheets
    }
    let sheets = createSheets()
    return {
      activeSheetId: Object.keys(sheets[2])[0],
      sheets: sheets,
      calendarInputs: this.getMockEvents()
    }

  }

  getMockEvents(){
    let eventManager = new EventManagerService();
    let years = [2021, 2022, 2023];
    let months = [0, 3, 4, 5, 11];
    let days = [1, 5, 15, 28];
    let events = [
      [
        {hours: 10, minutes: 15, duration: 120, summary: "This is a test event 1", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
        {hours: 10, minutes: 20, duration: 120, summary: "This is a test event 2", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
        {hours: 12, minutes:  0, duration:  12, summary: "This is a test event 3", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
        {hours: 14, minutes: 50, duration:  60, summary: "This is a test event 4", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
        {hours: 15, minutes: 50, duration: 70, summary: "This is a test event 5", description: this.getDescription() , uniqueId: this.idProvider.getUniqueId()},
      ],
      [
        {hours: 10, minutes: 15, duration: 120, summary: "This is a test event 1", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
        {hours: 14, minutes: 20, duration: 120, summary: "This is a test event 2", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
      ],
      [
        {hours: 10, minutes: 15, duration: 120, summary: "This is a test event 1", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
        {hours: 10, minutes: 20, duration: 120, summary: "This is a test event 2", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
        {hours: 12, minutes:  0, duration:  12, summary: "This is a test event 3", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
        {hours: 14, minutes: 50, duration:  60, summary: "This is a test event 4", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
        {hours: 15, minutes: 50, duration: 50, summary: "This is a test event 5", description: this.getDescription() , uniqueId: this.idProvider.getUniqueId()},
        {hours: 16, minutes: 50, duration:  30, summary: "This is a test event 4", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
        {hours: 17, minutes: 50, duration: 20, summary: "This is a test event 5", description: this.getDescription() , uniqueId: this.idProvider.getUniqueId()},
      ],
      [
        {hours: 7, minutes: 15, duration: 10, summary: "This is a test event 1", description: this.getDescription()  , uniqueId: this.idProvider.getUniqueId()},
        {hours: 9, minutes: 20, duration: 120, summary: "This is a test event 2", description: this.getDescription() , uniqueId: this.idProvider.getUniqueId()},
        {hours: 12, minutes:  0, duration:  12, summary: "This is a test event 3", description: this.getDescription(), uniqueId: this.idProvider.getUniqueId()},
        {hours: 15, minutes: 50, duration: 70, summary: "This is a test event 5", description: this.getDescription() , uniqueId: this.idProvider.getUniqueId()},
      ],     
    ] 
    
    let getMonthEvents = function(){
      let output: any[] = [];
      for(let month of months) {
        let dayEventsForMonth = getDayEvents();
        let singleMonth = eventManager.getCalendarMonthEntryAsObject(month, dayEventsForMonth)
        output.push(singleMonth);
      }
      return output;
    }
    let getDayEvents = function() {
      let output : any[] = []
      for (let i = 0; i<days.length ; i++){
        let eventsForDay = eventManager.getCalendarDayEntryAsObject(days[i], events[i])
        output.push(eventsForDay)
      }
      return output;
    }
    let getYearEvents = function(){
      let output: any[] = [];
      for(let year of years) {
        let monthEventsForYear = getMonthEvents();
        let singleYear = eventManager.getCalendarYearEntryAsObject(year, monthEventsForYear)
        output.push(singleYear)
      } 
      return output;
    }
    return getYearEvents(); 
   }

  getDescription(){
    return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper, augue sit amet tempor imperdiet, .'
  }

  // return{
  //   hours: hours, 
  //   minutes: minutes, 
  //   duration: duration, 
  //   summary: summary, 
  //   description: description, 
  //   uniqueId: uniqueId
  // }

  

  getFreshDocument(){
    this.colorProvider.restart();
    let startColor = this.colorProvider.getNextColor();
    let newSheet = this.getFreshSheet(startColor);
    return {
      activeSheetId: Object.keys(newSheet)[0],
      sheets: [newSheet],
      calendarInputs: this.getFreshCalendar(),
    }
    
  }

  getNextAddedPage(lastUsedColor: string){
    let color = this.colorProvider.getColorAfterGiven(lastUsedColor);
    return this.getPage(color, 'newPage', []);
  }
  getFreshCalendar(){
    return {}
  }
  getFreshSheet(startColor: string){
    let freshPage = this.getFreshPage(startColor);
    return this.getSheet(startColor, 'newSheet', [freshPage], Object.keys(freshPage)[0])
    }
  getFreshPage(startColor: string){
    return this.getPage(startColor, 'newPage', []);
  }
  getSheet(sheetColor: string, title: string, pages:any[], startPageId: string){
    if (sheetColor == '') sheetColor = this.colorProvider.getFirstColor();
    let id = this.idProvider.getUniqueId();
    let output = {[id]: {}}
    output[id] = {
      originalColor: sheetColor,
      bgColor: sheetColor,
      title: title,
      pages: pages,
      startPageId: startPageId
    }
    return output
  }

  getPage(pageColor: string, title: string, content: any[]){
    if (pageColor == '') pageColor = this.colorProvider.getFirstColor();
    let id = this.idProvider.getUniqueId();
    let output = {[id]: {}}
    output[id] = {
      notes: content,
      originalColor: pageColor,
      bgColor: pageColor,
      title: title
    }
    return output;
  }

  getNote(initialWidth: number, initialHeight: number, initialTop: number, initialLeft: number, content: string){
    let output = {
      uniqueId: this.idProvider.getUniqueId(),
      initialWidth: initialWidth,
      initialHeight: initialHeight,
      initialTop: initialTop,
      initialLeft: initialLeft,
      content: content
    }
    return output
  }
}
