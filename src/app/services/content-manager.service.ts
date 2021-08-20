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
    return this.getMockDocumentContent();
  }

  getSheetById(arrayOfSheetDescriptors: any[], id: string){
    let that = this;
    let finder = function(item:any){return item.id === id}
    let foundPage = arrayOfSheetDescriptors.find(finder);
    // if (foundPage == undefined) debugger
    return foundPage != undefined ? arrayOfSheetDescriptors[foundPage]['uniqueId'] : undefined;
  }

  getMockDocumentContent(){
    this.colorProvider.restart();
    let colors:string[] = [];
    let titles: string[] = [];
    let that = this;
    let noteSizes = [[200, 100], [120, 220], [50, 60], [60, 50], [80, 90]]
    let notePositions = [[100, 100], [220, 120], [100, 200], [200, 250], [80, 400]]
    let getArrayOfNotes = function(){
      let notes: any[] = [];
      for (let i = 0; i < 5; i++){
         let note = that.getNote(noteSizes[i][0], noteSizes[i][1], notePositions[i][0], notePositions[i][1], noteContent);
         notes.push(note)
      }
      return notes;
    }
    let getColors = function(nr: number) {
      for (let i = 0; i < nr; i++){
        colors.push(that.colorProvider.getNextColor())
      }
    }
    let getTitles = function(nr: number) {
      for (let i = 0; i < nr; i++){
        titles.push(`title ${i}`)
      }
    }
    let noteContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper, augue sit amet tempor imperdiet, .'
    let getPages = function(nr: number){
      getColors(nr)
      getTitles(nr)
      
      let pages = [];
      for (let i = 0; i < nr; i++){
        let arrayOfNotes = getArrayOfNotes();
        pages.push(that.getPage(colors[i], titles[i], arrayOfNotes))
      }
      return pages;
    }
    let createSheets = function(){
      let pages = getPages(5);
      return [ that.getSheet(colors[0], titles[0], pages, Object.keys(pages[1])[0]) ]
    }
    let sheets = createSheets()
    return {
      sheets: sheets,
      calendarInputs: {}
    }

  }

  

  getFreshDocument(){
    this.colorProvider.restart();
    let startColor = this.colorProvider.getNextColor();
    return {
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
