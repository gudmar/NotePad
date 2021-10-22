import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { DescriptorToDataService } from '../../services/descriptor-to-data.service'
import { StorageManagerService } from '../../services/storage-manager.service';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css']
})
export class SheetComponent implements OnInit {
  
  currentPageNotes: string[] = [];
  @Input() uniqueId: string = '';
  @Input() bgColor: string = 'white';
  @Input() pages: any[] = [];
  @Input() lastAddedPageId: any = undefined;
  // @Input() startPageId:string = '';
  private _currentPageId: string = '';//this.startPageId;
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
      ['killMe_page', 'obliteratePage', 'howManyChildrenDoIHave_page', 
       'changeCurrentPageTitle','addNextPageAfterUniqueId']
    )
  }

  handleMessages(eventType: string, data: any){
    if (eventType == 'addNextPageAfterUniqueId'){
      this.addNewPageAfterCertainPage(data.uniqueId)
    }
    if (eventType == "killMe_page") {
      if (data.nrOfChidren > 0) this.ensureUserIsPositive(data)
      else {
        if (data.uniqueId == this.currentPageId) this.showOtherPageAfterDeletion(data.uniqueId)
        this.deletePage(data.uniqueId)
      }
    }
    if (eventType == "obliteratePage") {
      if (data.uniqueId == this.currentPageId) this.showOtherPageAfterDeletion(data.uniqueId)
      this.deletePage(data.uniqueId)
    }
    if (eventType === 'howManyChildrenDoIHave_page') {
        let queriedPage = this.pages[this.getPageIndexById(data)]
        let queriedPageDescriptor: any = Object.values(queriedPage)[0]
        this.messenger.inform(
          'nrOfChidrenYouHave', 
          {uniqueId: data, nrOfOwnChildren: queriedPageDescriptor.notes.length}
        )
    }
    if (eventType === 'changeCurrentPageTitle'){
      if (this.currentPageId == data.pageId) {
        this.getCurrentPageDescriptor().title = data.title;
      }
    }
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
    let singleMatch = function(element: any){return Object.keys(element)[0] === id}
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
    // console.log(this.getPageDescriptorById(this.currentPageId))
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
    // let lastPageDesciptor:any = Object.values(this.pages[this.pages.length - 1])[0]
    // let newPage = this.storageManater.getNextAddedPage(lastPageDesciptor['originalColor'])
    // this.pages.push(newPage);
    // this.messenger.inform('newPageWasAdded', Object.keys(newPage)[0])
    let lastPageId = Object.keys(this.pages[this.pages.length - 1])[0];
    this.addNewPageAfterCertainPage(lastPageId)
  }

  addNewPageAfterCertainPage(previousPageId:string){
    
    // let lastPageDesciptor:any = Object.values(this.pages[this.pages.length - 1])[0]
    let lastPageDesciptor = this.getLastPageDescriptor();
    let lastPageIndex:number = this.getPageIndexById(previousPageId) + 1;
    let newPage = this.storageManater.getNextAddedPage(lastPageDesciptor['originalColor'])
    this.messenger.inform('setLastAddedPageId', {lastAddedPageId: Object.keys(newPage)[0]});
    console.log(newPage);
    console.log(lastPageIndex)
    console.log(this.pages)
    console.log(previousPageId)
    this.pages.splice(lastPageIndex,0,newPage);
    this.messenger.inform('newPageWasAdded', Object.keys(newPage)[0])
  }

  getLastPageDescriptor():any{
    let index = this.pages.length-1;
    if (this.lastAddedPageId != undefined) index = this.getPageIndexById(this.lastAddedPageId);
    return Object.values(this.pages[index])[0]
  }



}
