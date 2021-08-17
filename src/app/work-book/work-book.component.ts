import { Component, OnInit, Input, Output } from '@angular/core';
import { ContentManagerService } from '../services/content-manager.service';
import { UniqueIdProviderService } from '../services/unique-id-provider.service';
import { NextColorGeneratorService } from '../services/next-color-generator.service'

@Component({
  selector: 'work-book',
  templateUrl: './work-book.component.html',
  styleUrls: ['./work-book.component.css'],
  providers: [
              ContentManagerService,
              UniqueIdProviderService,
              NextColorGeneratorService
             ]
})
export class WorkBookComponent implements OnInit {
  @Input() documentContent: any;
  listOfSheets:any[] = this.contentManager.getListOfSheetsFromMemory();
  colorGenerator = new NextColorGeneratorService();
  constructor(private contentManager: ContentManagerService, private idProvider: UniqueIdProviderService) { }

  ngOnInit(): void {
    this.listOfSheets = this.contentManager.getListOfSheetsFromMemory();
    
  }
  extractSheetId(sheetDescriptor: any){
    return Object.keys(sheetDescriptor)[0];
  }
  extractSheedDescriptor(sheetDescriptor: any): any{
    let _sheetDescriptor = sheetDescriptor[this.extractSheetId(sheetDescriptor)]
    // debugger
    return _sheetDescriptor
  }

}
