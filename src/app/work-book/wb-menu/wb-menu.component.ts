import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DescriptorToDataService } from '../../services/descriptor-to-data.service'


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
  constructor(private descriptorTranslator: DescriptorToDataService) { }

  ngOnInit(): void {
    console.log(this.sheets)
  }

  switchSheet(data:any){
    this.currentSheetId = data;
    this.sheetSwitched.emit(data);
  }

  getSheetsId(descriptor: any){return this.descriptorTranslator.getDescriptorsId(descriptor)}
  getSheetsTitle(descriptor: any) {return this.descriptorTranslator.getDescriptorValues(descriptor).title}
  getSheetsBgColor(descriptor: any) {return this.descriptorTranslator.getDescriptorValues(descriptor).bgColor}
  checkIfSheetIsActive(descriptor: any) { return this.currentSheetId === this.getSheetsId(descriptor)}
}
