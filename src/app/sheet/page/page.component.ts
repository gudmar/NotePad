import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  _isInEditMode: boolean = false;
  set isInEditMode(val: boolean) {
    this._isInEditMode = val;
  }
  get isInEditMode() {return this._isInEditMode}
  @Input() uniqueId: string = '';
  @Input() bgColor: string = '';
  @Input() notes: any[] = [];
  @Output() deleteThisPageEvent: EventEmitter<string> = new EventEmitter();
  @Output() addPageAfterThisPageEvent: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  deleteThisPage(){this.deleteThisPageEvent.emit();}
  addAfterThisPage() {this.addPageAfterThisPageEvent.emit();}
  enterEditMode() {this.isInEditMode = true}
  exitEditMode() {this.isInEditMode = false;}

}

// (deleteMe) = "deleteThisPage()"
// (addAfterMe) = "addAfterThisPage()"
// (editMode) = "enterEditMode()"
// (exitEditMode) = "exitEditMode()"
