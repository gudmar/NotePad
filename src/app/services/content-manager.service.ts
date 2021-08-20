import { Injectable } from '@angular/core';
import { UniqueIdProviderService } from './unique-id-provider.service';
import { NextColorGeneratorService } from './next-color-generator.service'
import { start } from 'repl';

@Injectable({
  providedIn: 'root',
})
export class ContentManagerService {

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
      calendarInputs: {}
    }

  }

  

  getFreshDocument(){
    this.colorProvider.restart();
    let startColor = this.colorProvider.getNextColor();
    return {
      activeSheetId: 'Put correct id here',
      sheets: this.getFreshSheet(startColor),
      calendarInputs: this.getFreshCalendar(),
    }
    
  }

  getNextAddedPage(){
    let color = this.colorProvider.getNextColor();
    return this.getPage(color, 'mock-page', []);
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
  getSheet(color: string, title: string, pages:any[], startPageId: string){
    let id = this.idProvider.getUniqueId();
    let output = {[id]: {}}
    output[id] = {
      bgColor: color,
      title: title,
      pages: pages,
      startPageId: startPageId
    }
    return output
  }

  getPage(color: string, title: string, content: any[]){
    let id = this.idProvider.getUniqueId();
    let output = {[id]: {}}
    output[id] = {
      notes: content,
      bgColor: color,
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
