import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'wb-menu-entry',
  templateUrl: './wb-menu-entry.component.html',
  styleUrls: ['./wb-menu-entry.component.css']
})
export class WbMenuEntryComponent implements OnInit {
  _isActive: boolean = true;
  @Input() uniqueId: string = '';
  @Input() title: string = 'newSheet';
  @Input() set isActive(val: boolean) {
    this._isActive = val;
    this.dynamicClasses.active = val;
  }
  @Input() bgColor: string = 'white';
  dynamicClasses: any = {
    active: true
  }
  @Output() sheetChanged: EventEmitter<string> = new EventEmitter();
  @HostListener('click')
    emitIWantToBeActive(){
      if (!this.isActive) this.sheetChanged.emit(this.uniqueId)
    }
  
  constructor() { }

  ngOnInit(): void {
  }

}
