import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommunicationService } from '../services/communication.service';
import { WindowSizeEvaluatorService } from '../services/window-size-evaluator.service';
import { StorageManagerService } from '../services/storage-manager.service';
import { GetActiveNoteDataService } from '../services/get-active-note-data.service';
import { DescriptorToDataService } from '../services/descriptor-to-data.service';
import { NextColorGeneratorService } from '../services/next-color-generator.service'

@Component({
  selector: 'note-pad',
  templateUrl: './note-pad.component.html',
  styleUrls: ['./note-pad.component.css'],
})
export class NotePadComponent implements OnInit {
  isHiddable: boolean = false;
  shouldBeHidden: boolean = false;
  currentSheetBgColor:string = '';
  currentSheetStartPageId:string = '';
  uniqueId:string = 'note-pad-id'

  colorGenerator = new NextColorGeneratorService();
  constructor(
    private messenger: CommunicationService,
    private windowSize: WindowSizeEvaluatorService,
    private storageManager: StorageManagerService,
    private activeNoteGetter: GetActiveNoteDataService,
    private descriptorTranslator: DescriptorToDataService
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
       'pageWasClicked',
       'clearAllCalendarInputs',
       'setLastAddedPageId'
      ]
    )
  }

  private _pages: any[] = [];
  @Input() document:any;
  set listOfSheets(val:any[]){this.document.sheets = val;}
  get listOfSheets() {return this.document.sheets;}
  set currentSheetId(val:string){this.document.activeSheetId = val;}
  get currentSheetId() {return this.document.activeSheetId;}
  set currentSheetPages(val:any[]) {this.extractSheetDescriptor(this.currentSheetId).pages = val}
  get currentSheetPages() {return this.extractSheetDescriptor(this.currentSheetId).pages;}
  set currentPageId(val:string) {this.extractSheetDescriptor(this.currentSheetId).startPageId = val;}
  get currentPageId() {return this.extractSheetDescriptor(this.currentSheetId).startPageId}
  get lastAddedPageId() {
    return this.descriptorTranslator.getElementFromArrayById(
      this.listOfSheets, this.currentSheetId
    )!.content.lastAddedPageId;
  }
  set lastAddedPageId(data:any){
    this.descriptorTranslator.getElementFromArrayById(
      this.listOfSheets, this.currentSheetId
    )!.content.lastAddedPageId = data.lastAddedPageId;
  }
  
  // @Output() sheetStartPageChanged = new EventEmitter<string>();
  // @Output() sheetSwitched = new EventEmitter<string>();
  // @Input() set pages(val: any[]){this._pages = val; console.log(val)}
  // get pages(){return this._pages}

  switchStartPage(data:any){
    this.currentSheetStartPageId = data.newPageId;
    this.descriptorTranslator.getElementFromArrayById(
      this.listOfSheets, this.currentSheetId
    )!.content.startPageId = data.newPageId;
  }

  switchSheet(data:any){
    this.currentSheetId = data;
    this.initializeNewSheet(data);
  }
  

  ngOnInit(): void {
    this.initializeNewSheet(this.currentSheetId)
  }

  @HostListener('window:resize', ['$event'])
  checkIfmenuNeedsToBeHidden(){
    this.isHiddable = this.windowSize.isWindowTooNarrow();
    this.shouldBeHidden = this.isHiddable;
  }

  initializeNewSheet(newSheetId: string){
    let currentSheetDescriptor = this.extractSheetDescriptor(newSheetId);
    this.currentSheetBgColor = currentSheetDescriptor.bgColor;
    this.currentSheetPages = currentSheetDescriptor.pages;
    console.log(currentSheetDescriptor)
    this.currentSheetStartPageId = currentSheetDescriptor.startPageId;
  }

  extractSheetDescriptor(sheetId: string): any{
    let descriptor = this.descriptorTranslator.getElementFromArrayById(this.listOfSheets, sheetId);
    if (descriptor == undefined) return null;
    let _sheetDescriptor = descriptor.content
    return _sheetDescriptor
  }

  setLastAddedPageId(data:any){
    this.descriptorTranslator.getElementFromArrayById(this.listOfSheets, this.currentSheetId)!.content.lastAddedPageId = data.lastAddedPageId;
  }

  showMenu(){this.shouldBeHidden = false;}
  hideMenu() {this.shouldBeHidden = true;}



  handleMessages(eventType: string, data: any){
    // if (eventType === "storageOperation") { 
    //   let feedback = this.storageManager.handleStorageOperation(data, this.document);
    //   // if (feedback.information === 'dataLoaded'){
    //   //   if (feedback.payload!= null){
    //   //     this.reloadDocument(feedback.payload)
    //   //     // this.document = feedback.payload;
    //   //     // this.listOfSheets = this.document.sheets;
    //   //     // this.activeSheetId = this.document.activeSheetId;    
    //   //     // this.initializeNewSheet(this.activeSheetId)    
    //   //   }
    //   // }
    //   if (feedback.information === 'keysExistingInStorage'){
        
    //   }
      
    //   if (feedback.information === 'newContent'){
    //     this.loadDocumentToView(feedback.payload)
    //   }
    //   // feedback.information: [dataSaved, dataLoaded, storageCleared, keysExistingInStorage]
    // }
    if (eventType == 'pageWasClicked'){
      if(this.isHiddable) this.shouldBeHidden = true;
    }
    // if (eventType == 'clearAllCalendarInputs'){
    //   this.document.calendarInputs = [];
    //   this.calendarInputs = this.document.calendarInputs;
    // }
    if (eventType === 'addNextSheet'){
      if (data.after == 'last'){
        let lastSheetDescriptor: any = Object.values(this.listOfSheets[this.listOfSheets.length - 1])[0]
        this.listOfSheets.push(this.storageManager.getNextSheet(this.colorGenerator.getColorAfterGiven(lastSheetDescriptor.originalColor)))
      }
    }
    // if (eventType === 'saveDocument'){
    //   let copyOfDocument = JSON.parse(JSON.stringify(this.document));
    //   let activeNoteData = this.getActiveNoteData();
    //   if (activeNoteData != null) {
    //     this.changeNoteContent(copyOfDocument, activeNoteData.content, activeNoteData.uniqueId)
    //   }
    //   this.storageManager.saveContentAs(data, this.document)
      
    // }
    // if (eventType === 'saveToLastUsedKey'){
    //   let activeNoteData = this.activeNoteGetter.getActiveNoteData(this.messenger);
    //   this.storageManager.saveAsLastUsedKey(this.document, activeNoteData);
    // }
    // if (eventType == 'loadDocument'){
    //   let newDocument = this.storageManager.loadContent(data)
    //   this.reloadDocument(newDocument)
    // }
    // if (eventType == 'LoadFromFile'){
    //   this.reloadDocument(data)
    // }
    // if (eventType == 'switchToCalendar'){
    //   this.application = 'calendar'
    // }
    // if (eventType == 'switchToNotes'){this.application = 'notes'}
    if (eventType == "changeSheetTitle"){
      if (data.uniqueId == this.currentSheetId){
        this.extractSheetDescriptor(data.uniqueId).title = data.title;
      }
    }
    // if (eventType =='loadFreshDocument'){
    //   let newDocument = this.storageManager.getNewDocumentAndClearLastUsed();
    //   this.reloadDocument(newDocument)
    // }
    // if (eventType == 'saveToFile'){
    //   this.messenger.inform('displaySaveToFileWindow', this.document)
    //   // this.fileOperations.writeToFile(this.storageManager.getDefaultKey(), this.document)
    // }
    if (eventType == 'setLastAddedPageId'){
      this.setLastAddedPageId(data)
    }
  }



}
