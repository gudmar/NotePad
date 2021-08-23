import { Component, OnInit, Input, Output, ChangeDetectorRef } from '@angular/core';
import { ContentManagerService } from '../services/content-manager.service';
import { UniqueIdProviderService } from '../services/unique-id-provider.service';
import { NextColorGeneratorService } from '../services/next-color-generator.service'
import { DescriptorToDataService } from '../services/descriptor-to-data.service'
import { CommunicationService } from '../services/communication.service'
import { StorageManagerService } from '../services/storage-manager.service'

@Component({
  selector: 'work-book',
  templateUrl: './work-book.component.html',
  styleUrls: ['./work-book.component.css'],
  providers: [
              ContentManagerService,
              UniqueIdProviderService,
              NextColorGeneratorService
             ]
})
export class WorkBookComponent implements OnInit {
  document: any = this.contentManager.getDocumentFromMemory();
  listOfSheets:any[] = this.document.sheets;
  _activeSheetId: string = this.document.activeSheetId;
  uniqueId: string = "workBookId"
  set activeSheetId(val: string){
    this._activeSheetId = val;
  }
  get activeSheetId() {return this._activeSheetId; }
  @Input() documentContent: any;
  currentSheetBgColor: string = '';
  currentSheetPages: any[] = [];
  currentSheetStartPageId: string = '';

  colorGenerator = new NextColorGeneratorService();
  constructor(private descriptorTranslator: DescriptorToDataService, 
    private contentManager: ContentManagerService, 
    private idProvider: UniqueIdProviderService,
    private messenger: CommunicationService,
    private storageManager: StorageManagerService,
    private changeDetector: ChangeDetectorRef
  ) { 
    messenger.subscribe(
      this.uniqueId, 
      this.handleMessages.bind(this), 
      ['storageOperation', 'addNextSheet', 'saveDocument']
    )
  }

  handleMessages(eventType: string, data: any){
    if (eventType === "storageOperation") { 
      let feedback = this.storageManager.handleStorageOperation(data, this.document);
      if (feedback.information === 'dataLoaded'){
        if (feedback.payload!= null){
          this.reloadDocument(feedback.payload)
          // this.document = feedback.payload;
          // this.listOfSheets = this.document.sheets;
          // this.activeSheetId = this.document.activeSheetId;    
          // this.initializeNewSheet(this.activeSheetId)    
        }
      }
      if (feedback.information === 'keysExistingInStorage'){
        console.log(feedback.payload)
      }
      if (feedback.information === 'newContent'){
        this.loadDocumentToView(feedback.payload)
      }
      // feedback.information: [dataSaved, dataLoaded, storageCleared, keysExistingInStorage]
    }
    if (eventType === 'addNextSheet'){
      if (data.after == 'last'){
        let lastSheetDescriptor: any = Object.values(this.listOfSheets[this.listOfSheets.length - 1])[0]
        this.listOfSheets.push(this.storageManager.getNextSheet(this.colorGenerator.getColorAfterGiven(lastSheetDescriptor.originalColor)))
      }
    }
    if (eventType === 'saveDocument'){
      this.storageManager.saveContentAs(data, this.document)
      debugger
    }
  }

  reloadDocument(documentData: any){
    this.loadDocumentToView(this.contentManager.getFreshDocument())
    this.loadDocumentToView(documentData)

  }

  loadDocumentToView(documentData: any){
    this.document = documentData
    this.listOfSheets = this.document.sheets;
    this.activeSheetId = this.document.activeSheetId;    
    this.initializeNewSheet(this.activeSheetId) 
  }




  ngOnInit(): void {
    this.listOfSheets = this.document.sheets;
    this.activeSheetId = this.document.activeSheetId;
    this.initializeNewSheet(this.activeSheetId)
  }

  initializeNewSheet(newSheetId: string){
    let currentSheetDescriptor = this.extractSheetDescriptor(newSheetId);
    this.currentSheetBgColor = currentSheetDescriptor.bgColor;
    this.currentSheetPages = currentSheetDescriptor.pages;
    this.currentSheetStartPageId = currentSheetDescriptor.startPageId;
  }

  extractSheetDescriptor(sheetId: string): any{
    let descriptor = this.descriptorTranslator.getElementFromArrayById(this.listOfSheets, sheetId);
    if (descriptor == undefined) return null;
    let _sheetDescriptor = descriptor.content
    return _sheetDescriptor
  }

  switchSheet(data: any){
    this.activeSheetId = data;
    this.initializeNewSheet(data);
  }

  switchStartPage(data:any){
    this.currentSheetStartPageId = data.newPageId;
    this.descriptorTranslator.getElementFromArrayById(this.listOfSheets, this.activeSheetId)!.content.startPageId = data.newPageId;
  }

}
