import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FindNoteByIdService {

  constructor() { }

  fetchNoteReferenceById(noteId: string, documentInstance: any){
    let sheets = this.fetchSheets(documentInstance);
    for(let sheet of sheets){
      let note = this.findNoteInSheet(noteId, Object.values(sheet)[0]);
      if (note != null) return note;
    }
    return null;
  }

  findNoteInSheet(noteId: string, sheet: any){
    let pages = sheet.pages;
    for(let item of pages){
      let page = Object.values(item)[0];
      let note = this.findNoteInPage(noteId, page)
      if (note != null) return note;
    }
    return null
  }

  findNoteInPage(noteId: string, page: any){
    let notes = page.notes;
    for (let note of notes){
      if (note.uniqueId === noteId) return note;
    }
    return null;
  }

  fetchSheets(documentInstance: any){
    return documentInstance.sheets;
  }
}
