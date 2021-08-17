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
  @Input() uniqueId: string = '';
  @Input() bgColor: string = 'white';
  @Input() pages: any[] = [];
  @Input() startPageId:string = '';
  currentPageId: string = this.startPageId;
  

  constructor(private descriptorParser: DescriptorToDataService, private contentManager: ContentManagerService) { }

  ngOnInit(): void {
    this.currentPageId = this.startPageId;
    console.log(this.pages)
    console.log(this.currentPageId)
  }

  getCurrentPagesNotes(){
    let pageDescriptor = this.getCurrentPageDescriptor();
    return pageDescriptor == undefined ? undefined : pageDescriptor.notes;
  }
  
  getCurrentPagesColor(){
    let pageDescriptor = this.getCurrentPageDescriptor();
    return pageDescriptor == undefined ? undefined : pageDescriptor.bgColor;
  }

  getCurrentPageDescriptor(){
    let serachedObject = this.descriptorParser.getElementFromArrayById(this.pages, this.currentPageId)
    return serachedObject == undefined ? undefined : serachedObject.content
  }

  setToNewPage(newId: string){
    this.currentPageId = newId;
  }

  displayPageById(data: any){
    this.currentPageId = data;
  }

  addNewPage(){
    this.pages.push(this.contentManager.getNextAddedPage());
  }

}
