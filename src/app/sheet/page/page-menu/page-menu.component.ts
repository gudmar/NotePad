import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.css']
})
export class PageMenuComponent implements OnInit {
  _inEditMode: boolean = false;
  set inEditMode(val: boolean) {
    this._inEditMode = val;
    if (val == false) this.exitEditMode.emit();
    if (val == true)  this.editMode.emit();
    this.editButtonClassList.active = val;
  }
  editButtonClassList = {
    active: false
  }
  @Output() editMode: EventEmitter<string> = new EventEmitter()
  @Output() deleteMe: EventEmitter<string> = new EventEmitter()
  @Output() addAfterMe: EventEmitter<string> = new EventEmitter();
  @Output() exitEditMode: EventEmitter<string> = new EventEmitter();
  isMenuActive: boolean = true;
  constructor(private messenger: CommunicationService) { }

  ngOnInit(): void {
    
  }

  enterEditMode(data:any){
    // this.editMode.emit()
    this.inEditMode = !this._inEditMode
    data.stopPropagation()
  }
  showAllNotes(data: any){
    this.messenger.inform('showAllNotes', '')
    data.stopPropagation()
  }
  addNewPageAfterThis(data: any){
    this.addAfterMe.emit();
    data.stopPropagation()
  }
  deleteThisPage(data: any) {
    this.deleteMe.emit();
  }

}
