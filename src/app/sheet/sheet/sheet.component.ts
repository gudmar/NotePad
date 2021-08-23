import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { DescriptorToDataService } from '../../services/descriptor-to-data.service'
import { ContentManagerService } from '../../services/content-manager.service';
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
    private contentManager: ContentManagerService,
    private storageManater: StorageManagerService,
    private messenger: CommunicationService,
  ) { }
  // 'killMe_page', {uniqueId: this.uniqueId, nrOfChidren: this.notes.length})

  ngOnInit(): void {
    // this.currentPageId = this.startPageId;
    this.messenger.subscribe(this.uniqueId, this.handleMessages.bind(this), ['killMe_page', 'obliteratePage'])
  }

  handleMessages(eventType: string, data: any){
    if (eventType == "killMe_page") {
      if (data.nrOfChidren > 0) this.ensureUserIsPositive(data)
      else {
        this.showOtherPageAfterDeletion(data.uniqueId)
        this.deletePage(data.uniqueId)
      }
    }
    if (eventType == "obliteratePage") {
      this.showOtherPageAfterDeletion(data.uniqueId)
      this.deletePage(data.uniqueId)
    }
  }

  ensureUserIsPositive(pagesId: string){
    this.messenger.inform('confirmationMessage', 
        {message:'This page sill contains notes, are You sure You want to remove it?', uniqueId: pagesId})
  }

  deletePage(pageId: string){
    let pageIndex = this.getPageIndexById(pageId);
    
    this.pages.splice(pageIndex, 1);
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
    console.log('Changing page')
    this.currentPageId = data;
  }

  addNewPage(){
    let lastPageDesciptor:any = Object.values(this.pages[this.pages.length - 1])[0]
    let newPage = this.storageManater.getNextAddedPage(lastPageDesciptor['originalColor'])
    this.pages.push(newPage);
  }

}
