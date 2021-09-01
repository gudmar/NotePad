import { Injectable } from '@angular/core';
import { UniqueIdProviderService } from './unique-id-provider.service';
import { NextColorGeneratorService } from './next-color-generator.service'

@Injectable({
  providedIn: 'root'
})



export class StorageManagerService {
  constructor(private idProvider: UniqueIdProviderService,
    private colorProvider: NextColorGeneratorService) { }
  
  notePadMemoryObject: string = 'notePadMemoryObject'

  saveContent(data: any){
    // localStorage.setItem('notePad', JSON.stringify(data))
  }

  saveContentAs(key: string, data: any){
    // localStorage.setItem(key, JSON.stringify(data))
    let memObj = this.getMemoryObject();
    Object.assign(memObj, {[key]: data});
    this.setObject(memObj)
    this.setLastUsedNoteDocumentToStorage(key)
  }

  setObject(obj: any){
    localStorage.setItem(this.notePadMemoryObject, JSON.stringify(obj))
  }

  deleteSingleKey(key: string){
    // localStorage.removeItem(key)
    this.removeItemFromStorage(key)
  }

  loadContent(key: string){
    // let content = localStorage.getItem(key)
    // if (content == null) return content
    // return JSON.parse(content);
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
  saveAsLastUsedKey(dataToSave: any){
    let lastUsedKey = this.getLastUsedNoteDocument();
    if (lastUsedKey == null || lastUsedKey == ''){
      lastUsedKey = this.getDefaultKey();
    }
    this.saveContentAs(lastUsedKey, dataToSave)
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

}
