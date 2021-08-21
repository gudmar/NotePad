import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { NextColorGeneratorService } from '../../../services/next-color-generator.service'


@Component({
  selector: 'wb-menu-entry',
  templateUrl: './wb-menu-entry.component.html',
  styleUrls: ['./wb-menu-entry.component.css']
})
export class WbMenuEntryComponent implements OnInit {
  _isActive: boolean = true;
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
  
  constructor(private colorManager: NextColorGeneratorService) { }

  ngOnInit(): void {
  }

}
