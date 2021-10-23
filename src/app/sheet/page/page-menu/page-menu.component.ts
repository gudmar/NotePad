import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';
import { HslOrHexToHexPipe } from '../../../pipes/hsl-or-hex-to-hex.pipe'

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
  get inEditMode() {return this._inEditMode;}
  editButtonClassList = {
    active: false
  }
  @Input() bgColor: string = 'yellow';
  @Output() editMode: EventEmitter<string> = new EventEmitter()
  @Output() deleteMe: EventEmitter<string> = new EventEmitter()
  @Output() addAfterMe: EventEmitter<string> = new EventEmitter();
  @Output() exitEditMode: EventEmitter<string> = new EventEmitter();
  @Output() changeColorEvent: EventEmitter<any> = new EventEmitter();
  isMenuActive: boolean = true;
  constructor(private messenger: CommunicationService) { }

  ngOnInit(): void {}

  @HostListener('window:keydown.control.e', ['$event]'])
  toggleEditModeOnShortcut(event:any){
    event.preventDefault();
    this.enterEditMode(event);
    this.messenger.inform('displayMessageAndDoNotDisturb', {message: `Edit mode ${this.inEditMode?'on':'off'}`})
  }

  enterEditMode(data:any){
    // this.editMode.emit()
    this.inEditMode = !this._inEditMode
    data.stopPropagation()
  }
  changeColor(data: any){
    this.changeColorEvent.emit({newColor: data.srcElement.value});
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
