import { Injectable } from '@angular/core';
import { UniqueIdProviderService } from './unique-id-provider.service';
import { NextColorGeneratorService } from './next-color-generator.service'
import { FindNoteByIdService } from './find-note-by-id.service';

@Injectable()



export class StorageManagerService {
  constructor(private idProvider: UniqueIdProviderService,
    private colorProvider: NextColorGeneratorService,
    private noteByIdFinder: FindNoteByIdService,
  ) {}
  
  notePadMemoryObject: string = 'notePadMemoryObject'

  saveContent(data: any){
    // localStorage.setItem('notePad', JSON.stringify(data))
  }

  saveAsGeneral(key: string, dataToBeSaved: any, activeNoteData: any){
    if (activeNoteData == null) this.saveContentAs(key, dataToBeSaved);
    else this.saveWithActiveNoteContent(key, dataToBeSaved, activeNoteData);
  }

  saveContentAs(key: string, data: any){
    // localStorage.setItem(key, JSON.stringify(data))
    let memObj = this.getMemoryObject();
    Object.assign(memObj, {[key]: data});
    this.setObject(memObj)
    this.setLastUsedNoteDocumentToStorage(key)
  }

  saveWithActiveNoteContent(key:string, data:any, activeNoteInfo: any){
    let copyOfCurrentObject = JSON.parse(JSON.stringify(data));
    let activeNoteContent = activeNoteInfo.content;
    let activeNoteId = activeNoteInfo.uniqueId;
    let noteReferenceInCopiedObj = this.noteByIdFinder.fetchNoteReferenceById(activeNoteId, copyOfCurrentObject);
    noteReferenceInCopiedObj.content = activeNoteInfo.content;
    this.saveContentAs(key, copyOfCurrentObject);
  }

  setObject(obj: any){
    localStorage.setItem(this.notePadMemoryObject, JSON.stringify(obj))
  }

  deleteSingleKey(key: string){
    // localStorage.removeItem(key)
    this.removeItemFromStorage(key)
  }

  loadContent(key: string){
    let memObj = this.getMemoryObject();
    if (this.hasKey(key)) {
      this.setLastUsedNoteDocumentToStorage(key);
      return memObj[key];
    }
    return null;
  }

  hasKey(key: string){
    // return localStorage.getItem(key) != null;
    let memObj = this.getMemoryObject();
    return memObj.hasOwnProperty(key)
  }

  clearStorage(){
    // localStorage.clear();
    localStorage.removeItem(this.notePadMemoryObject)
  }

  removeItemFromStorage(key: string){
    // localStorage.removeItem(key)
    if (this.hasKey(key)) {
      let memObj = this.getMemoryObject();
      delete memObj[key]
      this.setObject(memObj)
      if (key == this.getLastUsedNoteDocument()) localStorage.removeItem('__notePad_lastUsed')
    }
  }

  getMemoryObject(){
    if (!this.isMemoryObjectStored()) this.createNotepadMemoryObject();
    let a = <string>localStorage.getItem(this.notePadMemoryObject)
    let b = this.notePadMemoryObject
    return JSON.parse(<string>localStorage.getItem(this.notePadMemoryObject));
  } 

  // getKeyIndex(key: string):number{
  //   if (this.isMemoryObjectStored()) {
  //     let memoryObject = JSON.parse(<string>localStorage.getItem(this.notePadMemoryObject));

  //   }
  //   return -1;
  // }

  getAllItemsFromStorage(){
    let isMemoryObjectStored = this.isMemoryObjectStored();
    let memObj = localStorage.getItem(this.notePadMemoryObject);
    if (memObj != null){
      if (this.isMemoryObjectStored()) return Object.keys(JSON.parse(memObj))
    }
    return []
    // return Object.keys(localStorage);
  }


  createNotepadMemoryObject(){
    if (!this.isMemoryObjectStored()) localStorage.setItem(this.notePadMemoryObject, '{}');
  }

  private isMemoryObjectStored(): boolean{
    let keys = Object.keys(localStorage);
    let isMemoryObjectStored = (keys.findIndex((e:string)=>{return e==this.notePadMemoryObject})!=-1);
    return isMemoryObjectStored
  }

  setLastUsedNoteDocumentToStorage(documentName: string){
    localStorage.setItem('__notePad_lastUsed', documentName)
  }
  getLastUsedNoteDocument(){
    return localStorage.getItem('__notePad_lastUsed')
  }
  saveAsLastUsedKey(dataToSave: any, activeNoteData: any){
    let lastUsedKey = this.getLastUsedNoteDocument();
    if (lastUsedKey == null || lastUsedKey == ''){
      lastUsedKey = this.getDefaultKey();
    }
    this.saveAsGeneral(lastUsedKey, dataToSave, activeNoteData)
  }


  getDefaultKey(){
    let now = new Date(Date.now());
    return `NotePad${now.getFullYear()}${now.getMonth()}${now.getDay()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`
  }


  handleStorageOperation(operationType: string, applicationData: any){
    if (operationType === 'saveWholeDocument') { 
      this.saveContent(applicationData);
      return {information: 'dataSaved'}
    }
    // if (operationType === 'loadWholeDocument'){
    //   return {information: 'dataLoaded', payload: this.loadContent()}
    // }
    if (operationType === 'clearStorage'){
      this.clearStorage();
      return {information: 'sotrageCleared'}
    }
    if (operationType === 'getAllKeysFromStorage'){
      return {information: 'keysExistingInStorage', payload: this.getAllItemsFromStorage()}
    }
    if (operationType === 'newDocument'){
      return {information: 'newContent', payload: this.getFreshDocument()}
    }


    return {information: 'operation not supported'}
  }

  getNewDocumentAndClearLastUsed(){
    localStorage.removeItem('__notePad_lastUsed');
    return this.getFreshDocument();
  }

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
    let color = this.colorProvider.getColorAfterGiven(lastUsedColor)
    return this.getPage(color, 'newPage', []);
  }

  getNextSheet(lastUsedColor: string){
    let color = this.colorProvider.getColorAfterGiven(lastUsedColor);
    let newPage = this.getPage(this.colorProvider.getFirstColor(), 'newPage', [])
    return this.getSheet(color, 'newSheet', [newPage], Object.keys(newPage)[0]);
  }

  getFreshCalendar(){
    return []
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

  getNote(initialWidth: number, 
      initialHeight: number, 
      initialTop: number, 
      initialLeft: number, 
      content: string,
      isActive?: boolean
    ){
    let output = {
      uniqueId: this.idProvider.getUniqueId(),
      initialWidth: initialWidth,
      initialHeight: initialHeight,
      initialTop: initialTop,
      initialLeft: initialLeft,
      content: content,
      isActive: isActive == undefined || isActive == false? false : true
    }
    return output
  }

  getNewDocumentWithInstructions(){
    let content = `
    {"activeSheetId":"kuuckcofaj0lz1j8ao","sheets":[{"kuuckcofaj0lz1j8ao":{"originalColor":"hsl(60, 100%, 80%)","bgColor":"hsl(60, 100%, 80%)","title":"newSheet","pages":[{"kuuckcof3k3c871tqao":{"notes":[],"originalColor":"hsl(60, 100%, 80%)","bgColor":"hsl(60, 100%, 80%)","title":"newPage"}},{"kuue20b6f183ft0ovwf":{"notes":[{"uniqueId":"kuue2n2dkinjm1ogrtc","initialWidth":319,"initialHeight":1233,"initialTop":27.390625,"initialLeft":169,"content":"<span>Welcome,</span><br><br><b><u>Notes:</u></b><br><span>1.&nbsp;</span><b>Menu-&gt;help for help</b><br><span>2.&nbsp;</span><b>Ctrl+e || Options-&gt;Edit</b><span>&nbsp;mode to enter edit mode,</span><br><span>3. In edit mode click anywhere to start a new note and type to enter note,</span><br><span>4. Highlight text and press&nbsp;</span><b>ctrl+l</b><span>&nbsp;to create a link out of it.&nbsp;</span><u>!Clicking a link works only in non edit mode, as in edit mode links can be edited.</u><br><div class='copyable'>5. Highlight text and press ctrl+m to create a copyable text like this one</div><span>6. Just click copyable text to copy it to clipboard. !This works in not edit mode. In edit mode content can be edited instead<br></span><span>7. Ctrl+d to delete highlighed text</span><br><span>8. Click upper tab to switch page</span><br><span>9. Click side menu tab to switch sheet</span><br><br><b><u>Calendar</u></b><br><span>1.&nbsp;</span><b>Menu-&gt;Calendar</b><span>&nbsp;to enter claendar. !It takes a while for calendar view to render</span><br><span>2. Click any day of year to open a task editor. Click on + icon to enter new task</span><br><span>3. Click number of calendar week to see a week task view</span><br><span>4. Enter any year from 1000 to 3000 in box in the top to go to that year view. !Rendering takes a while</span><br><br><b><u>Linker</u></b><br><span>1. Can save any number of links and search for any of saved links.</span><br><span>2.&nbsp;</span><b>Menu-&gt;Linker</b><br><br><b><u>Saving content:</u></b><br><b>1. BEWARE, content is not saved automaticly</b><span>. Have to hit&nbsp;</span><b>ctrl+s<br></b><span>2.&nbsp;</span><b>Ctrl+s&nbsp;</b><span>||</span><b>&nbsp;Menu-&gt;Save</b><span>&nbsp;to save as default key</span><br><span>3.&nbsp;</span><b>Menu-&gt;Save as</b><span>&nbsp;to name key</span><br><span>4.&nbsp;</span><b>Menu-&gt;Save to file</b><span>&nbsp;to backup current document as txt file</span><br><br><b><u>Loading content:</u></b><br><span>1.&nbsp;</span><b>Menu-&gt;Load from key</b><span>&nbsp;to load from browser memory</span><br><span>2.&nbsp;</span><b>Menu-&gt;Load form file</b><span>&nbsp; to load form backupped txt file</span><br><span>3. Drag and drop on a page or calendar a backupped txt file to load file to application.</span><br><span>4. Don't just drop any file, as it will be validated, and only proper files will be opened.</span>","isActive":false}],"originalColor":"hsl(120, 100%, 80%)","bgColor":"#caf7da","title":"DeleteMe->"}}],"startPageId":"kuue20b6f183ft0ovwf","lastAddedPageId":"kuue20b6f183ft0ovwf"}}],"calendarInputs":[],"links":[]}
    `
    return JSON.parse(content);
  }




  // fetchNoteReferenceById(noteId: string, documentInstance: any){
  //   let sheets = this.fetchSheets(documentInstance);
  //   for(let sheet of sheets){
  //     let note = this.findNoteInSheet(noteId, Object.values(sheet)[0]);
  //     if (note != null) return note;
  //   }
  //   return null;
  // }

  // findNoteInSheet(noteId: string, sheet: any){
  //   let pages = sheet.pages;
  //   for(let item of pages){
  //     let page = Object.values(item)[0];
  //     let note = this.findNoteInPage(noteId, page)
  //     if (note != null) return note;
  //   }
  //   return null
  // }

  // findNoteInPage(noteId: string, page: any){
  //   let notes = page.notes;
  //   for (let note of notes){
  //     if (note.uniqueId === noteId) return note;
  //   }
  //   return null;
  // }

  // fetchSheets(documentInstance: any){
  //   return documentInstance.sheets;
  // }
}
