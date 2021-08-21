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
  @Input() sheets: any = []
  @Output() sheetSwitched: EventEmitter<string> = new EventEmitter();
  @Input() currentSheetId: string = '';
  @Output() sheetAdded: EventEmitter<any> = new EventEmitter();
  colorGenerator = new NextColorGeneratorService();
  constructor(private descriptorTranslator: DescriptorToDataService, 
    private messenger: CommunicationService,
  ) { }

  ngOnInit(): void {
    console.log(this.sheets)
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
