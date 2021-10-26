import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommunicationService } from '../services/communication.service';
import { WindowSizeEvaluatorService } from '../services/window-size-evaluator.service';
import { StorageManagerService } from '../services/storage-manager.service';
import { GetActiveNoteDataService } from '../services/get-active-note-data.service';
import { DescriptorToDataService } from '../services/descriptor-to-data.service';
import { NextColorGeneratorService } from '../services/next-color-generator.service'
import { timingSafeEqual } from 'crypto';
import { GetDocumentService } from '../services/get-document.service';

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
    private descriptorTranslator: DescriptorToDataService,
    private documentProvider: GetDocumentService
  ) { 
    messenger.subscribe(
      this.uniqueId, 
      this.handleMessages.bind(this), 
      [
       'deleteSheetRequest',
       'addNextSheet',
       'changeSheetTitle',
       'pageWasClicked',
       'setLastAddedPageId',
       'obliterateSheet',
       'providingDocumentObjectToWorkbookChild'
      ]
    )
  }

  private _document:any;
  currentSheet:any = {};
  @Input() set document(val:any){
    this._document = val;
    this.currentSheet = this.extractSheetDescriptor(val.activeSheetId);
  }
  get document(){return this._document;}
  set listOfSheets(val:any[]){
    this.document.sheets = val;
  }
  get listOfSheets() {
    return this.document.sheets;
  }
  set currentSheetId(val:string){
    this.document.activeSheetId = val;
  }
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

  switchStartPage(data:any){
    this.currentSheetStartPageId = data.newPageId;
    this.descriptorTranslator.getElementFromArrayById(
      this.listOfSheets, this.currentSheetId
    )!.content.startPageId = data.newPageId;
  }

  switchSheet(data:any){
    this.currentSheetId = data;
    this.currentSheet = this.extractSheetDescriptor(data);
    this.currentPageId = this.currentPageId;
    this.currentPageId = this.currentSheet.startPageId;
    
    this.initializeNewSheet(data);
  }
  
  ngOnChanges():void{
  }

  ngOnInit(): void {
    this.messenger.inform('provideDocumentToChildComponent', null);
    this.initializeNewSheet(this.currentSheetId);
    this.messenger.inform('routeSwitched', 'notePad')
  }

  @HostListener('window:resize', ['$event'])
  checkIfmenuNeedsToBeHidden(){
    this.isHiddable = this.windowSize.isWindowTooNarrow();
    this.shouldBeHidden = this.isHiddable;
  }

  initializeNewSheet(newSheetId: string){
    let currentSheetDescriptor = this.extractSheetDescriptor(newSheetId);
    this.currentSheet = currentSheetDescriptor;
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
    if (eventType == 'providingDocumentObjectToWorkbookChild'){
      console.log(data)
      this.document = data;
    }
    if (eventType == 'pageWasClicked'){
      if(this.isHiddable) this.shouldBeHidden = true;
    }
    if (eventType === 'addNextSheet'){
      if (data.after == 'last'){
        let lastSheetDescriptor: any = Object.values(this.listOfSheets[this.listOfSheets.length - 1])[0]
        let a = this.storageManager.getNextSheet(this.colorGenerator.getColorAfterGiven(lastSheetDescriptor.originalColor));
        this.document.sheets.push(this.storageManager.getNextSheet(this.colorGenerator.getColorAfterGiven(lastSheetDescriptor.originalColor)));
      }
    }
    if (eventType == "changeSheetTitle"){
      if (data.uniqueId == this.currentSheetId){
        this.extractSheetDescriptor(data.uniqueId).title = data.title;
      }
    }
    if (eventType == 'setLastAddedPageId'){
      this.setLastAddedPageId(data)
    }
    if (eventType == 'deleteSheetRequest') {
      this.sheetDeletionConfirmationProcedure(data);
    }
    if (eventType == 'obliterateSheet'){
      this.deleteSheetAsItIsConfirmed(data);
    }
  }

  deleteSheetAsItIsConfirmed(data:any){
    let targetSheetId = data;
    let sheets = this.document.sheets;
    if (sheets.length <= 1){
      this.messenger.inform('userInfo', {
        type: 'error',
        message: 'Last sheet cannot be deleted',
        timeout: 2500
      })
    } else {
      if (this.currentSheetId === data){
        let indexOfTargetSheet = this.findSheetIndex(data);
        if (indexOfTargetSheet == 0) {
          let nextSheetId = this.getAllSheetIds()[1];
          this.currentSheet = this.extractSheetDescriptor(nextSheetId);
          this.currentSheetId = this.getSheetId(1);
          this.document.activeSheetId = this.currentSheetId;
          this.deleteSheet(data)
        } else {
          let nextSheetId = this.getAllSheetIds()[indexOfTargetSheet - 1];
          this.currentSheet = this.extractSheetDescriptor(nextSheetId);
          this.currentSheetId = this.getSheetId(indexOfTargetSheet - 1);
          this.document.activeSheetId = this.currentSheetId;
          this.deleteSheet(data)
        }
      } else {
        this.deleteSheet(data)
      }
    }
  }

  sheetDeletionConfirmationProcedure(data:any){
    let sheets = this.document.sheets
    if (sheets.length > 1){
      let sheetForDeletionIndex = this.findSheetIndex(data)
      let sheetPlannedForDeletionObject: any = sheets[sheetForDeletionIndex]
      let sheetForDeletionDescriptor: any = Object.values(sheetPlannedForDeletionObject)[0];
      let nrOfChildrenSheetHas = sheetForDeletionDescriptor.pages.length;
      let nrOfNotesFirstPageHas = this.getNrOfNotesFirstPageHas(sheetForDeletionDescriptor)
      if (nrOfChildrenSheetHas == 0) {
        this.messenger.inform('', data)
        console.error('Wow, this sheet seems to have no child pages. How is this possible?')
      } else if (nrOfChildrenSheetHas == 1 && this.getNrOfNotesFirstPageHas(sheetForDeletionDescriptor) == 0) {
        this.messenger.inform('obliterateSheet', data)
      } else if (nrOfChildrenSheetHas > 1){
        this.messenger.inform(
          'confirmationMessage_deleteSheet',
          {
            message: 'Sheet selected for deletion has child pages. Are you sure you want to delete it?',
            uniqueId: data
          }
        )
      } else if (nrOfChildrenSheetHas == 1 && this.getNrOfNotesFirstPageHas(sheetForDeletionDescriptor) > 0){
        this.messenger.inform(
          'confirmationMessage_deleteSheet',
          {
            message: 'Child page has child notes. Are you sure you want to delete it?',
            uniqueId: data
          }
        )          
      }
    } else {
      this.messenger.inform('userInfo', {
        message: 'Last sheet cannot be deleted', timeout: 2500, type: 'error'
      })
    }
  }

  getSheetId(sheetIndex:number){
    return this.getAllSheetIds()[sheetIndex];
  }
  getAllSheetIds(){
    let ids:string[]=[];
    for(let item of this.document.sheets) ids.push(Object.keys(item)[0])
    return ids;
  }
  deleteSheet(id:string){
    let index:number = this.findSheetIndex(id);
    this.document.sheets.splice(index,1);
  }
  findSheetIndex(id:string){
    let singleMatch = function(element: any){return Object.keys(element)[0] === id}
    return this.document.sheets.findIndex(singleMatch)      
  }
  getNrOfNotesFirstPageHas(sheetDescriptor: any){
    let firstPageDescriptor:any = Object.values(sheetDescriptor.pages[0])[0]
    let nrOfPages = firstPageDescriptor.notes.length;
    return nrOfPages;
  }
  ngOnDestroy(){
    this.messenger.unsubscribe(this.uniqueId);
  }

}
