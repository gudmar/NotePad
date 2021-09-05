import { Component, OnInit, Input, Output, ChangeDetectorRef } from '@angular/core';
import { FalseDataMockService } from '../services/false-data-mock.service';
import { UniqueIdProviderService } from '../services/unique-id-provider.service';
import { NextColorGeneratorService } from '../services/next-color-generator.service'
import { DescriptorToDataService } from '../services/descriptor-to-data.service'
import { CommunicationService } from '../services/communication.service'
import { StorageManagerService } from '../services/storage-manager.service'
import { FileOperationsService } from '../services/file-operations.service';
import { DocumentValidatorService } from '../services/document-validator.service';


@Component({
  selector: 'work-book',
  templateUrl: './work-book.component.html',
  styleUrls: ['./work-book.component.css'],
  providers: [
    FalseDataMockService,
              UniqueIdProviderService,
              NextColorGeneratorService
             ]
})
export class WorkBookComponent implements OnInit {
  _document: any = this.mockDataProvider.getDocumentFromMemory();
  set document(val: any) {
    this._document = val
    this.calendarInputs = val.calendarInputs
    // debugger
  };
  get document() {return this._document}
  listOfSheets:any[] = this.document.sheets;
  _activeSheetId: string = this.document.activeSheetId;
  uniqueId: string = "workBookId"
  application: string = 'notes' //'calendar'
  set activeSheetId(val: string){
    this._activeSheetId = val;
  }

  get activeSheetId() {return this._activeSheetId; }
  @Input() documentContent: any;
  currentSheetBgColor: string = '';
  currentSheetPages: any[] = [];
  currentSheetStartPageId: string = '';
  calendarInputs: any = [];

  colorGenerator = new NextColorGeneratorService();
  constructor(private descriptorTranslator: DescriptorToDataService, 
    private mockDataProvider: FalseDataMockService, 
    private idProvider: UniqueIdProviderService,
    private messenger: CommunicationService,
    private storageManager: StorageManagerService,
    private changeDetector: ChangeDetectorRef,
    private fileOperations: FileOperationsService,
    private documentValidator: DocumentValidatorService
  ) { 
    messenger.subscribe(
      this.uniqueId, 
      this.handleMessages.bind(this), 
      ['storageOperation', 
       'addNextSheet', 
       'saveDocument', 
       'loadDocument', 
       'LoadFromFile',
       'switchToCalendar', 
       'switchToNotes',
       'changeSheetTitle',
       'loadFreshDocument',
       'saveToFile',
       'gotFileWithDataToLoad'
      ]


    )
  }

  loadLastDocument(){
    let lastUsedDocument = this.storageManager.getLastUsedNoteDocument();
    if (lastUsedDocument != null){
      this.document = this.storageManager.loadContent(lastUsedDocument)
    } else {
      this.document = this.storageManager.getFreshDocument();
    }
  }

  handleMessages(eventType: string, data: any){
    if (eventType === "storageOperation") { 
      let feedback = this.storageManager.handleStorageOperation(data, this.document);
      // if (feedback.information === 'dataLoaded'){
      //   if (feedback.payload!= null){
      //     this.reloadDocument(feedback.payload)
      //     // this.document = feedback.payload;
      //     // this.listOfSheets = this.document.sheets;
      //     // this.activeSheetId = this.document.activeSheetId;    
      //     // this.initializeNewSheet(this.activeSheetId)    
      //   }
      // }
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

    }
    if (eventType === 'saveToLastUsedKey'){
      this.storageManager.saveAsLastUsedKey(this.document);
    }
    if (eventType == 'loadDocument'){
      let newDocument = this.storageManager.loadContent(data)
      this.reloadDocument(newDocument)
    }
    if (eventType == 'LoadFromFile'){
      this.reloadDocument(data)
    }
    // if (eventType == 'gotFileWithDataToLoad'){
    //   let validatedData = this.documentValidator.validateAsString(data);
    //   if (validatedData == null) this.messenger.inform('informUser', 'Passed file is not valid')
    //   else (console.log(validatedData))
    // }
    if (eventType == 'switchToCalendar'){
      this.application = 'calendar'
    }
    if (eventType == 'switchToNotes'){this.application = 'notes'}
    if (eventType == "changeSheetTitle"){
      if (data.uniqueId == this.activeSheetId){
        this.extractSheetDescriptor(data.uniqueId).title = data.title;
      }
    }
    if (eventType =='loadFreshDocument'){
      let newDocument = this.storageManager.getNewDocumentAndClearLastUsed();
      this.reloadDocument(newDocument)
    }
    if (eventType == 'saveToFile'){
      this.fileOperations.writeToFile(this.storageManager.getDefaultKey(), this.document)
    }
  }

  reloadDocument(documentData: any){
    this.loadDocumentToView(this.mockDataProvider.getFreshDocument())
    this.loadDocumentToView(documentData)

  }

  loadDocumentToView(documentData: any){
    this.document = documentData
    this.listOfSheets = this.document.sheets;
    this.activeSheetId = this.document.activeSheetId;    
    this.initializeNewSheet(this.activeSheetId) 
  }




  ngOnInit(): void {
    this.loadLastDocument();
    this.listOfSheets = this.document.sheets;
    this.activeSheetId = this.document.activeSheetId;
    this.calendarInputs = this.document.calendarInputs;
    this.initializeNewSheet(this.activeSheetId);
    console.dir(this.document)

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
