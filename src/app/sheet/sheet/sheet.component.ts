import { Component, OnInit, Input, Output } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { DescriptorToDataService } from '../../services/descriptor-to-data.service'
import { ContentManagerService } from '../../services/content-manager.service';

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
  } 
  get currentPageId() {return this._currentPageId}
  

  constructor(private descriptorParser: DescriptorToDataService, private contentManager: ContentManagerService) { }

  ngOnInit(): void {
    // this.currentPageId = this.startPageId;
  }

  // getCurrentPagesNotes(){
  //   let pageDescriptor = this.getCurrentPageDescriptor();
  //   return pageDescriptor == undefined ? undefined : pageDescriptor.notes;
  // }

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
    this.pages.push(this.contentManager.getNextAddedPage());
  }

}
