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
    let noteContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper, augue sit amet tempor imperdiet, felis quam lobortis arcu, nec lobortis arcu augue quis lectus. Sed elit lectus, dictum in rhoncus cursus, dignissim nec neque. Etiam blandit sapien lectus, non porttitor orci porta non. Sed iaculis pretium ultricies. Maecenas sagittis suscipit libero non rutrum. Aliquam pharetra augue in massa semper vehicula. Sed at metus et tortor condimentum placerat non vitae nulla. Sed viverra elit a nunc ullamcorper, sed sagittis orci iaculis. Integer sollicitudin turpis vitae nulla finibus, ut vehicula nibh varius. Nunc placerat rutrum tellus sed facilisis. Aenean iaculis urna eget velit sodales mattis. Nam a nunc euismod, viverra ligula sit amet, tempor neque. Vivamus non vulputate odio. Vestibulum at sollicitudin felis. Mauris condimentum luctus ipsum id facilisis.'
    let getPages = function(nr: number){
      getColors(nr)
      getTitles(nr)
      let pages = [];
      for (let i = 0; i < nr; i++){
        pages.push(that.getPage(colors[i], titles[i], noteContent))
      }
      return pages;
    }
    let createSheets = function(){
      let pages = getPages(5);
      return [ that.getSheet(colors[0], titles[0], pages, Object.keys(pages[1])[0]) ]
    }
    let sheets = createSheets()
    console.log('I am mocking contoent')
    console.dir(sheets)
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
    return this.getPage(color, 'mock-page', '');
  }
  getFreshCalendar(){
    return {}
  }
  getFreshSheet(startColor: string){
    let freshPage = this.getFreshPage(startColor);
    return this.getSheet(startColor, 'newSheet', [freshPage], Object.keys(freshPage)[0])
    }
  getFreshPage(startColor: string){
    return this.getPage(startColor, 'newPage', '');
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

  getPage(color: string, title: string, content: string){
    let id = this.idProvider.getUniqueId();
    let output = {[id]: {}}
    output[id] = {
      notes: content,
      bgColor: color,
      title: title
    }
    return output;
  }
}
