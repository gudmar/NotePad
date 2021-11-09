import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { DescriptorToDataService } from '../../services/descriptor-to-data.service'
import { StorageManagerService } from '../../services/storage-manager.service';
import { CommunicationService } from '../../services/communication.service';
import { ConcatSource } from 'webpack-sources';

@Component({
  selector: 'sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css']
})
export class SheetComponent implements OnInit {
  
  currentPageNotes: string[] = [];

  private _pages:any[]=[];
  @Input() set pages(val:any[]){
    this._pages =val;
  }
  get pages(){return this._pages}

  @Input() uniqueId: string = '';
  @Input() bgColor: string = 'white';
  @Input() lastAddedPageId: any = undefined;
  private _currentPageId: string = '';
  @Input() set currentPageId(val: string) {
    this._currentPageId = val;
    this.currentPageNotes = this.getPageNotesById(val)
    this.sheetStartPageChanged.emit({
      sheetId: this.uniqueId,
      newPageId: val
    })
  } 

  @Output() sheetStartPageChanged: EventEmitter<any> = new EventEmitter();

  get currentPageId() {return this._currentPageId}
  

  constructor(private descriptorParser: DescriptorToDataService, 
    private storageManater: StorageManagerService,
    private messenger: CommunicationService,
  ) { }

  ngOnInit(): void {
    this.messenger.subscribe(
      this.uniqueId, 
      this.handleMessages.bind(this), 
      [
        'deletePageRequest', 
        'deletePageConfirmed', 
        'ObliterateSheet', 
        'changeCurrentPageTitle',
        'addNextPageAfterUniqueId']
    )
  }

  handleMessages(eventType: string, data: any){
    if (eventType == 'addNextPageAfterUniqueId'){
      this.addNewPageAfterCertainPage(data.uniqueId)
    }
    if (eventType == "deletePageRequest") {
      let nrOfChildrenTargetPageHas = this.getNrOfChildrenPageHas(data.targetPageId)
      if (nrOfChildrenTargetPageHas > 0) this.ensureUserIsPositive(data.targetPageId)
      else {
        if (data.targetPageId == this.currentPageId) this.showOtherPageAfterDeletion(data.targetPageId)
        this.deletePage(data.targetPageId)
      }
    }
    if (eventType == "deletePageConfirmed") {
      if (data == this.currentPageId) this.showOtherPageAfterDeletion(data)
      this.deletePage(data)
    }
    if (eventType === 'changeCurrentPageTitle'){
      if (this.currentPageId == data.pageId) {
        this.getCurrentPageDescriptor().title = data.title;
      }
    }
  }

  getNrOfChildrenPageHas(pageUniqueId:string){
    let queriedPage = this.pages[this.getPageIndexById(pageUniqueId)]
    let queriedPageDescriptor: any = Object.values(queriedPage)[0]
    return queriedPageDescriptor.notes.length
  }

  ensureUserIsPositive(pagesId: string){
    this.messenger.inform('confirmationMessage', 
        {message:'This page sill contains notes, are you sure you want to remove it?', uniqueId: pagesId})
  }

  deletePage(pageId: string){
    if(this.pages.length > 1){
      let pageIndex = this.getPageIndexById(pageId);
      this.pages.splice(pageIndex, 1);
      this.messenger.inform('setLastAddedPageId', {lastAddedPageId: undefined})
      this.messenger.inform('pageWasDeleted', pageId)  
    } else {
      this.messenger.inform('userInfo', {
        type: 'error',
        message: 'Last sheet page cannot be deleted',
        timeout: 2500
      })
    }
  }

  showOtherPageAfterDeletion(deletedPageId: string){
    let deletedPageIndex = this.getPageIndexById(deletedPageId);
    let nrOfPages = this.pages.length;
    let isDeletedOnFirstIndex = (deletedPageIndex == 0);
    let newPageIndex: number = 0;
    if (nrOfPages > 1){
      newPageIndex = deletedPageIndex - 1
      if (isDeletedOnFirstIndex) newPageIndex = 1;
      let newPagesUniqueId = Object.keys(this.pages[newPageIndex])[0];
      this.currentPageId = newPagesUniqueId
    }
  }

  getPageIndexById(id: string){
    let singleMatch = function(element: any){
      return Object.keys(element)[0] === id
    }
    return this.pages.findIndex(singleMatch)
  }
  changePageColor(data:any){
    let pageIndex = this.getPageIndexById(this.currentPageId);
    let currentPageDescriptor:any = Object.values(this.pages[pageIndex])[0]
    currentPageDescriptor.bgColor = data.newColor;
  }

  getPageNotesById(id: string){
    let pageDescriptor = this.getPageDescriptorById(id);
    return pageDescriptor == undefined ? undefined : pageDescriptor.notes;    
  }
  
  getCurrentPagesColor(){
    let pageDescriptor = this.getCurrentPageDescriptor();
    return pageDescriptor == undefined ? undefined : pageDescriptor.bgColor;
  }

  getCurrentPageDescriptor(){
    return this.getPageDescriptorById(this.currentPageId)
  }

  getPageDescriptorById(id: string){
    let serachedObject = this.descriptorParser.getElementFromArrayById(this.pages, id)
    return serachedObject == undefined ? undefined : serachedObject.content
  }

  setToNewPage(newId: string){
    this.currentPageId = newId;
  }

  displayPageById(data: any){
    this.currentPageId = data;
  }

  addNewPage(){
    let lastPageId = Object.keys(this.pages[this.pages.length - 1])[0];
    this.addNewPageAfterCertainPage(lastPageId)
  }

  addNewPageAfterCertainPage(previousPageId:string){
    let lastPageDesciptor = this.getLastPageDescriptor();
    let lastPageIndex:number = this.getPageIndexById(previousPageId) + 1;
    let newPage = this.storageManater.getNextAddedPage(lastPageDesciptor['originalColor'])
    this.messenger.inform('setLastAddedPageId', {lastAddedPageId: Object.keys(newPage)[0]});
    this.pages.splice(lastPageIndex,0,newPage);
    this.messenger.inform('newPageWasAdded', Object.keys(newPage)[0])
  }

  getLastPageDescriptor():any{
    let index = this.pages.length-1;
    if (this.lastAddedPageId != undefined) index = this.getPageIndexById(this.lastAddedPageId);
    return Object.values(this.pages[index])[0]
  }

  ngOnChanges(){}
  ngOnDestroy(){
    this.messenger.unsubscribe(this.uniqueId);
  }
}
