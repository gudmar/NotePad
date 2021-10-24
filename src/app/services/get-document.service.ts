import { Injectable } from '@angular/core';
import { StorageManagerService } from './storage-manager.service';

@Injectable({
  providedIn: 'root'
})
export class GetDocumentService {

  constructor(
    private storageManager: StorageManagerService
  ) { 
    
  }
  document:any;
  getDocument(){
    let lastUsedDocument = this.storageManager.getLastUsedNoteDocument();
    if (lastUsedDocument != null){
      this.document = this.storageManager.loadContent(lastUsedDocument)
    } else {
      // this.document = this.storageManager.getFreshDocument();
      this.document = this.storageManager.getNewDocumentWithInstructions();
    }
    console.dir(this.document)
    return this.document;
  }
}
