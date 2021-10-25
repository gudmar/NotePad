import { Component, OnInit, Input, Output, EventEmitter, HostListener, Host } from '@angular/core';
import { DescriptorToDataService } from '../../services/descriptor-to-data.service'
import { CommunicationService } from '../../services/communication.service'
import { NextColorGeneratorService } from '../../services/next-color-generator.service'
import { FileOperationsService } from '../../services/file-operations.service';
import { AppMenuOperationsService } from '../../services/app-menu-operations.service';
import { WindowSizeEvaluatorService } from '../../services/window-size-evaluator.service';


@Component({
  selector: 'wb-menu',
  templateUrl: './wb-menu.component.html',
  styleUrls: ['./wb-menu.component.css']
})
export class WbMenuComponent implements OnInit {
  uniqueId: string = 'workbookId'
  private idOfSheetSelectedForTermination: string = '';
  menu: AppMenuOperationsService = new AppMenuOperationsService(this.messenger);
  @Input() sheets: any = []
  @Output() sheetSwitched: EventEmitter<string> = new EventEmitter();
  @Input() currentSheetId: string = '';
  @Input() currentPageId: string = '';
  @Output() sheetAdded: EventEmitter<any> = new EventEmitter();
  colorGenerator = new NextColorGeneratorService();
  constructor(private descriptorTranslator: DescriptorToDataService, 
    private messenger: CommunicationService,
    private fileOperations: FileOperationsService,
    menu: AppMenuOperationsService,
  ) { }

  ngOnInit(): void {}

  deleteSheet(idOfSheetToDelete: string){
    let deletedSheetIndex = this.getIndexOfSheetById(idOfSheetToDelete)
    this.sheets.splice(deletedSheetIndex, 1);
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
  }

  addNextSheet(){
    this.messenger.inform('addNextSheet', {after: 'last'})
  }

  getSheetsId(descriptor: any){return this.descriptorTranslator.getDescriptorsId(descriptor)}
  getSheetsTitle(descriptor: any) {return this.descriptorTranslator.getDescriptorValues(descriptor).title}
  getSheetsBgColor(descriptor: any) {return this.descriptorTranslator.getDescriptorValues(descriptor).bgColor}
  checkIfSheetIsActive(descriptor: any) { return this.currentSheetId === this.getSheetsId(descriptor)}
}

