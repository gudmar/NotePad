import { Component, OnInit, Input, Output } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';

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
  

  constructor() { }

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
    let serachedObject = this.getElementFromArrayById(this.pages, this.currentPageId)
    return serachedObject == undefined ? undefined : serachedObject.content
  }

  getElementFromArrayById(array: any[], id: string){
    let finder = function(item: any){
      let keys: string[] = Object.keys(item)
      return keys[0] === id
    }
    let indexOfSearchedElement = array.findIndex(finder);
    if (indexOfSearchedElement == -1) return undefined;
    let elementUuid: string = Object.keys(array[indexOfSearchedElement])[0];
    return {
      uuid: elementUuid,
      content: array[indexOfSearchedElement][elementUuid]
    }
  }

  // getPageId(pageItem: any){
  //   return Object.keys(pageItem)[0];
  // }
  // getPageColor(pageItem: any){
  //   return pageItem.bgColor
  // }
  // getPageContent(pageItem: any){
  //   return pageItem.notes
  // }

  setToNewPage(newId: string){
    this.currentPageId = newId;
  }

}
