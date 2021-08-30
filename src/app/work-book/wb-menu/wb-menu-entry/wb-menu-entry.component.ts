import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { NextColorGeneratorService } from '../../../services/next-color-generator.service';
import { CommunicationService } from '../../../services/communication.service'


@Component({
  selector: 'wb-menu-entry',
  templateUrl: './wb-menu-entry.component.html',
  styleUrls: ['./wb-menu-entry.component.css']
})
export class WbMenuEntryComponent implements OnInit {
  _isActive: boolean = true;
  changeSheetsTitleMode = false;
  @Input() isKillable: boolean = true;
  // private _bgColor:string = 'white';
  // fgColor: string = "black";
  @Input() uniqueId: string = '';
  @Input() title: string = 'newSheet';
  @Input() set isActive(val: boolean) {
    this._isActive = val;
    this.dynamicClasses.active = val;
  }
  // @Input() set bgColor (val: string) { 
  //   this._bgColor  = val;
  //   this.fgColor = this.colorManager.getFgColor(val);
  //   console.log(this.fgColor)
  // }
  // get bgColor() {return this._bgColor}
  @Input() bgColor: string = 'white'

  dynamicClasses: any = {
    active: true
  }
  @Output() sheetChanged: EventEmitter<string> = new EventEmitter();
  @HostListener('click')
    emitIWantToBeActive(){
      if (!this.isActive) this.sheetChanged.emit(this.uniqueId)
    }
  
  constructor(
    private colorManager: NextColorGeneratorService,
    private messenger: CommunicationService
  ) { }

  ngOnInit(): void {
  }

  killRelatedSheet(data: any){
    data.stopPropagation();
    this.messenger.inform('killSheet', this.uniqueId)
  }

  enterChangeSheetsTitleMode(){
    this.changeSheetsTitleMode = true;
  }

  @HostListener('focusout', ['$event'])
  saveSheetsTitle(event: any){
    this.changeSheetsTitleMode = true;
    let titleFromText = event.target.innerText;
    this.messenger.inform('changeSheetTitle', {
      uniqueId: this.uniqueId,
      title: titleFromText
    })
  }

}
