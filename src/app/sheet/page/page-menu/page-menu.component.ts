import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.css']
})
export class PageMenuComponent implements OnInit {
  @Output() editMode: EventEmitter<string> = new EventEmitter()
  @Output() deleteMe: EventEmitter<string> = new EventEmitter()
  @Output() addAfterMe: EventEmitter<string> = new EventEmitter();
  isMenuActive: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

  enterEditMode(data:any){
    this.editMode.emit()
  }
  deleteThisPage(data: any){
    this.deleteMe.emit();
  }
  addNewPageAfterThis(data: any){
    this.addAfterMe.emit();
  }

}
// <div class="page-menu-toggle-button center">
//         &#9776;
// </div>
// <div class="page-menu-wrapper" *ngIf="isMenuActive">
//     <div class="page-menu-button center" #edit (click)="enterEditMode($event)">&#9998;</div>
//     <div class="page-menu-button center" #delete (click)='deleteThisPage($event)'>&times;</div>
//     <div class="page-menu-button center" #addAfter (click)='addNewPageAfterThis($event)'>+</div>
// </div>