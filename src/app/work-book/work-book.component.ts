import { Component, OnInit, Input, Output, ChangeDetectorRef, HostListener } from '@angular/core';
import { FalseDataMockService } from '../services/false-data-mock.service';
import { UniqueIdProviderService } from '../services/unique-id-provider.service';
import { NextColorGeneratorService } from '../services/next-color-generator.service'
import { DescriptorToDataService } from '../services/descriptor-to-data.service'
import { CommunicationService } from '../services/communication.service'
import { StorageManagerService } from '../services/storage-manager.service'
import { FileOperationsService } from '../services/file-operations.service';
import { DocumentValidatorService } from '../services/document-validator.service';
import { GetActiveNoteDataService } from '../services/get-active-note-data.service';
import { WindowSizeEvaluatorService } from '../services/window-size-evaluator.service';


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
  @Input() isHiddable: boolean = false;
  @Input() shouldBeHidden: boolean = false;
  set document(val: any) {
    this._document = val
    this.calendarInputs = val.calendarInputs
  };
  get document() {return this._document}
  listOfSheets:any[] = this.document.sheets;
  _activeSheetId: string = this.document.activeSheetId;
  uniqueId: string = "workBookId"
  // application: string = 'notes' //'calendar'
  application: string = 'calendar'
  set activeSheetId(val: string){
    this._activeSheetId = val;
  }

  get activeSheetId() {return this._activeSheetId; }
  @Input() documentContent: any;
  currentSheetBgColor: string = '';
  currentSheetPages: any[] = [];
  currentSheetStartPageId: string = '';
  private _calendarInputs:any;
  // calendarInputs: any = [];
  set calendarInputs(val: any){
    this._calendarInputs = val;
  }
  get calendarInputs() {
    return this._calendarInputs;
  }

  colorGenerator = new NextColorGeneratorService();
  constructor(private descriptorTranslator: DescriptorToDataService, 
    private mockDataProvider: FalseDataMockService, 
    private idProvider: UniqueIdProviderService,
    private messenger: CommunicationService,
    private storageManager: StorageManagerService,
    private changeDetector: ChangeDetectorRef,
    private fileOperations: FileOperationsService,
    private documentValidator: DocumentValidatorService,
    private activeNoteGetter: GetActiveNoteDataService,
    private windowSize: WindowSizeEvaluatorService
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
       'gotFileWithDataToLoad',
       'saveToLastUsedKey',
       'pageWasClicked'
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
    if (eventType == 'pageWasClicked'){
      if(this.isHiddable) this.shouldBeHidden = true;
    }
    if (eventType === 'addNextSheet'){
      if (data.after == 'last'){
        let lastSheetDescriptor: any = Object.values(this.listOfSheets[this.listOfSheets.length - 1])[0]
        this.listOfSheets.push(this.storageManager.getNextSheet(this.colorGenerator.getColorAfterGiven(lastSheetDescriptor.originalColor)))
      }
    }
    if (eventType === 'saveDocument'){
      let copyOfDocument = JSON.parse(JSON.stringify(this.document));
      let activeNoteData = this.getActiveNoteData();
      if (activeNoteData != null) {
        this.changeNoteContent(copyOfDocument, activeNoteData.content, activeNoteData.uniqueId)
      }
      this.storageManager.saveContentAs(data, this.document)
    }
    if (eventType === 'saveToLastUsedKey'){
      let activeNoteData = this.activeNoteGetter.getActiveNoteData(this.messenger);
      this.storageManager.saveAsLastUsedKey(this.document, activeNoteData);
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
      this.messenger.inform('displaySaveToFileWindow', this.document)
      // this.fileOperations.writeToFile(this.storageManager.getDefaultKey(), this.document)
    }
  }

  // ****************** MOVE TO SERVICE ******************************
  getActiveNoteData(){
    let tempId = 'getActiveNoteContent'
    let activeNote: any = null;
    let messageHandler = function(eventType: string, data: any){activeNote = data;}
    this.messenger.subscribe(tempId, messageHandler, ['activeNoteDataIs']);
    let wasTransmissionSuccess:boolean = this.messenger.informWithFeedback('getActiveNoteContent', '');
    this.messenger.unsubscribe(tempId);
    return activeNote
  }
  changeNoteContent(documentInstance: any, activeNoteContent:string, noteId:string){
    
  }
  /**************************************************************/

  reloadDocument(documentData: any){
    this.loadDocumentToView(this.mockDataProvider.getFreshDocument())
    this.loadDocumentToView(documentData)

  }

  loadDocumentToView(documentData: any){
    // this.calendarInputs = []
    this.document = documentData
    this.listOfSheets = this.document.sheets;
    this.activeSheetId = this.document.activeSheetId;    
    setTimeout(()=>{this.calendarInputs = this.document.calendarInputs;});
    this.initializeNewSheet(this.activeSheetId);
    
  }
  ngAfterViewInit(){
    setTimeout(()=>{this.calendarInputs = this.document.calendarInputs;});
  }



  ngOnInit(): void {
    this.loadLastDocument();
    this.listOfSheets = this.document.sheets;
    this.activeSheetId = this.document.activeSheetId;
    this.calendarInputs = this.document.calendarInputs;
    this.initializeNewSheet(this.activeSheetId);
    // console.dir(this.document)
    this.checkIfmenuNeedsToBeHidden();

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

  @HostListener('window:resize', ['$event'])
  checkIfmenuNeedsToBeHidden(){
    this.isHiddable = this.windowSize.isWindowTooNarrow();
    this.shouldBeHidden = this.isHiddable;
    console.log(this.isHiddable)
    if (this.isHiddable) console.log('isHiddable')
  }

  showMenu(){
    this.shouldBeHidden = false;
  }
  hideMenu() {this.shouldBeHidden = true;}

}
