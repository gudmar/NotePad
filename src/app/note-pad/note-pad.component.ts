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
      [
       'addNextSheet',
       'changeSheetTitle',
       'pageWasClicked',
       'setLastAddedPageId'
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
  
  ngOnChanges():void{
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
    this.currentSheet = currentSheetDescriptor;
    // this.currentSheetBgColor = currentSheetDescriptor.bgColor;
    // this.currentSheetPages = currentSheetDescriptor.pages;
    // this.currentSheetStartPageId = currentSheetDescriptor.startPageId;
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
    if (eventType == 'pageWasClicked'){
      if(this.isHiddable) this.shouldBeHidden = true;
    }
    if (eventType === 'addNextSheet'){
      if (data.after == 'last'){
        let lastSheetDescriptor: any = Object.values(this.listOfSheets[this.listOfSheets.length - 1])[0]
        this.listOfSheets.push(this.storageManager.getNextSheet(this.colorGenerator.getColorAfterGiven(lastSheetDescriptor.originalColor)))
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
  }



}
