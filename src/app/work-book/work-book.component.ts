import { Component, OnInit, Input, Output } from '@angular/core';
import { ContentManagerService } from '../services/content-manager.service';
import { UniqueIdProviderService } from '../services/unique-id-provider.service';
import { NextColorGeneratorService } from '../services/next-color-generator.service'
import { DescriptorToDataService } from '../services/descriptor-to-data.service'

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
  document: any = this.contentManager.getDocumentFromMemory();
  listOfSheets:any[] = this.document.sheets;
  _activeSheetId: string = this.document.activeSheetId;
  set activeSheetId(val: string){
    this._activeSheetId = val;
  }
  get activeSheetId() {return this._activeSheetId; }
  @Input() documentContent: any;
  currentSheetBgColor: string = '';
  currentSheetPages: any[] = [];
  currentSheetStartPageId: string = '';

  colorGenerator = new NextColorGeneratorService();
  constructor(private descriptorTranslator: DescriptorToDataService, private contentManager: ContentManagerService, private idProvider: UniqueIdProviderService) { 
    // this.listOfSheets = this.document.sheets;
    // this.activeSheetId = this.document.activeSheetId;
    // this.initializeNewSheet(this.activeSheetId)

  }

  ngOnInit(): void {
    this.listOfSheets = this.document.sheets;
    this.activeSheetId = this.document.activeSheetId;
    this.initializeNewSheet(this.activeSheetId)
  }

  initializeNewSheet(newSheetId: string){
    let currentSheetDescriptor = this.extractSheetDescriptor(newSheetId);
    this.currentSheetBgColor = currentSheetDescriptor.bgColor;
    this.currentSheetPages = currentSheetDescriptor.pages;
    console.log(this.currentSheetStartPageId)
    this.currentSheetStartPageId = currentSheetDescriptor.startPageId;
    console.log(this.currentSheetStartPageId)
  }

  extractSheetDescriptor(sheetId: string): any{
    let descriptor = this.descriptorTranslator.getElementFromArrayById(this.listOfSheets, sheetId);
    if (descriptor == undefined) return null;
    let _sheetDescriptor = descriptor.content
    return _sheetDescriptor
  }

  switchSheet(data: any){
    this.activeSheetId = data;
    this.initializeNewSheet(data);
  }

}
