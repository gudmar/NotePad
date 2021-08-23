import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DescriptorToDataService } from '../../services/descriptor-to-data.service'
import { CommunicationService } from '../../services/communication.service'
import { NextColorGeneratorService } from '../../services/next-color-generator.service'


@Component({
  selector: 'wb-menu',
  templateUrl: './wb-menu.component.html',
  styleUrls: ['./wb-menu.component.css']
})
export class WbMenuComponent implements OnInit {
  uniqueId: string = 'workbookId'
  private idOfSheetSelectedForTermination: string = '';
  @Input() sheets: any = []
  @Output() sheetSwitched: EventEmitter<string> = new EventEmitter();
  @Input() currentSheetId: string = '';
  @Output() sheetAdded: EventEmitter<any> = new EventEmitter();
  colorGenerator = new NextColorGeneratorService();
  constructor(private descriptorTranslator: DescriptorToDataService, 
    private messenger: CommunicationService,
  ) { }

  ngOnInit(): void {
    this.messenger.subscribe(this.uniqueId, this.handleMessages.bind(this), ['killSheet', 'obliteratePage'])
  }

  handleMessages(eventType: string, data:any){
    let getNrOfNotesFirstPageHas = function(sheetDescriptor: any){
      let firstPageDescriptor:any = Object.values(sheetDescriptor.pages[0])[0]
      let nrOfPages = firstPageDescriptor.notes.length;
      return nrOfPages;
    }
    if (eventType == 'killSheet') {
      let sheetForDeletionIndex = this.getIndexOfSheetById(data)
      let sheetPlannedForDeletionObject: any = this.sheets[sheetForDeletionIndex]
      let sheetForDeletionDescriptor: any = Object.values(sheetPlannedForDeletionObject)[0];
      let nrOfChildrenSheetHas = sheetForDeletionDescriptor.pages.length;
      let nrOfNotesFirstPageHas = getNrOfNotesFirstPageHas(sheetForDeletionDescriptor)
      if (nrOfChildrenSheetHas == 0) {
        if (data == this.currentSheetId) this.showOtherSheetAfterDeletion(data);
        this.deleteSheet(data);
      } else if (nrOfChildrenSheetHas == 1 && getNrOfNotesFirstPageHas(sheetForDeletionDescriptor) == 0) {
        if (data == this.currentSheetId) this.showOtherSheetAfterDeletion(data);
        this.deleteSheet(data)
      } else {
        this.messenger.inform(
          'confirmationMessage',
          {
            message: 'Sheet selected for deletion has child pages. Are you sure you want to delete it?',
            uniqueId: data
          }
        )
      } 
    }
    if (eventType == "obliteratePage"){
      let sheetForDeletionIndex = this.getIndexOfSheetById(data)
      if (sheetForDeletionIndex > -1) {
        if (data == this.currentSheetId) this.showOtherSheetAfterDeletion(data);
        this.deleteSheet(data);
      }
      
    }
  }

  deleteSheet(idOfSheetToDelete: string){
    let deletedSheetIndex = this.getIndexOfSheetById(idOfSheetToDelete)
    this.sheets.splice(deletedSheetIndex, 1);
  }

  showOtherSheetAfterDeletion(deletedSheetId: string){
    let deletedSheetIndex = this.getIndexOfSheetById(deletedSheetId);
    let nrOfSheets = this.sheets.length;
    let isDeletedOnFirstIndex = (deletedSheetIndex == 0);
    let newSheetIndex: number = 0;
    if (nrOfSheets > 1){
      newSheetIndex = deletedSheetIndex - 1
      if (isDeletedOnFirstIndex) newSheetIndex = 1;
      let newSheetsUniqueId = Object.keys(this.sheets[newSheetIndex])[0];
      this.currentSheetId = newSheetsUniqueId
    }
  }

  getIndexOfSheetById(id: string){
    let singleMatch = function(element: any) {return Object.keys(element)[0] === id}
    return this.sheets.findIndex(singleMatch);
  }

  switchSheet(data:any){
    this.currentSheetId = data;
    this.sheetSwitched.emit(data);
  }

  passDataFromStorageToWBComponent(data:string){
    this.messenger.inform('storageOperation', data)
    // !!!!!!!!!!! NOT NEEDED - CLEAR EVERYTHING RELATED
  }

  openMemoryManager(){
    this.messenger.inform('displaySaveWindow', '')
  }


  addNextSheet(){
    this.messenger.inform('addNextSheet', {after: 'last'})
  }

  getSheetsId(descriptor: any){return this.descriptorTranslator.getDescriptorsId(descriptor)}
  getSheetsTitle(descriptor: any) {return this.descriptorTranslator.getDescriptorValues(descriptor).title}
  getSheetsBgColor(descriptor: any) {return this.descriptorTranslator.getDescriptorValues(descriptor).bgColor}
  checkIfSheetIsActive(descriptor: any) { return this.currentSheetId === this.getSheetsId(descriptor)}
}
