import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css']
})
export class SheetComponent implements OnInit {

  listOfChildPageTitles: string[] = ['tab 1', 'tab 2', 'tab 3', 'tab 1'];

  constructor() { }

  ngOnInit(): void {
  }

  getNewPageDescriptor(title: string, bgColor: string, contentDescriptor: {[prop: string]: string}){
    return {
      uniqueId: {
        title: {}
      }
    }
  }

  getUniqueTitle(){}

}
