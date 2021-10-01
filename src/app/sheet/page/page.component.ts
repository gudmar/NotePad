import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { NoteComponent } from '../../note/note.component'
import { CommunicationService } from '../../services/communication.service';
import { StorageManagerService } from '../../services/storage-manager.service';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
  // providers: [ CommunicationService ]
})
export class PageComponent implements OnInit {
  _isInEditMode: boolean = false;
  private newNoteIsAdded: boolean = false;
  set isInEditMode(val: boolean) {
    this._isInEditMode = val;
  }
  get isInEditMode() {return this._isInEditMode}
  @Input() uniqueId: string = '';
  @Input() bgColor: string = '';
  @Input() notes: any[] = [];
  @Output() deleteThisPageEvent: EventEmitter<string> = new EventEmitter();
  @Output() addPageAfterThisPageEvent: EventEmitter<string> = new EventEmitter();

  constructor(
    private messenger: CommunicationService, 
    private storeManager: StorageManagerService,
    private elRef: ElementRef,
  ) { }

  @HostListener('click', ['$event'])
  informThatThisPageWasClicked($event: any){
    $event.stopPropagation();
    if (!this.newNoteIsAdded){
      this.messenger.inform('pageWasClicked', $event)
    }
    this.newNoteIsAdded = false;
  }

  ngOnInit(): void {
    this.messenger.subscribe(this.uniqueId, 
      this.reactToDataFromMessengar.bind(this), 
      [
        'noteWasMoved', 
        'noteWasResized', 
        'noteContentChanged', 
        'killMe', 
        'noteWasClicked', 
        'pageWasClicked',
        'showAllNotes',
      ]
    );
  }

  reactToDataFromMessengar(eventType: string, data: any){
    if (eventType === 'noteWasMoved') {this.updateTargetNoteState(data.objectId, data)}
    if (eventType === 'noteWasResized') {this.updateTargetNoteState(data.objectId, data)}
    if (eventType === 'noteContentChanged') {this.updateTargetNoteState(data.objectId, data);}
    if (eventType === 'killMe') {this.obliterateNote(data);}
    if (eventType === 'noteWasClicked') {}
    if (eventType === 'showAllNotes') {
      this.messenger.inform('eachNoteShouldShow', '');
    }
    if (eventType === 'pageWasClicked') {
      this.addNewNoteIfInEditState(data)
    }
  }

  updateTargetNoteState(noteId: string, newState: {
          objectId: string, content?: string, newHeight?:number, newWidth?:number, pageX?:number, pageY?:number
        }){
    let that = this;
    let singleMatch = function(element: any){return element.uniqueId === noteId}
    let indexOfElementToUpdate = this.notes.findIndex(singleMatch);
    if (indexOfElementToUpdate != -1) {
      // let copy = this.notes.slice(0);
      let keysToUpdate = Object.keys(newState);
      for (let key of keysToUpdate) {
        // if (key == 'newWidth') copy[indexOfElementToUpdate].initialWidth = newState[key];
        // if (key == 'newHeight') copy[indexOfElementToUpdate].initialHeight = newState[key];
        // if (key == 'pageX') copy[indexOfElementToUpdate].initialLeft = newState[key];
        // if (key == 'pageY') copy[indexOfElementToUpdate].initialTop = newState[key];
        // if (key == 'content') copy[indexOfElementToUpdate].content = newState[key]

        if (key == 'newWidth') this.notes[indexOfElementToUpdate].initialWidth = newState[key];
        if (key == 'newHeight') this.notes[indexOfElementToUpdate].initialHeight = newState[key];
        if (key == 'pageX') this.notes[indexOfElementToUpdate].initialLeft = newState[key];
        if (key == 'pageY') this.notes[indexOfElementToUpdate].initialTop = newState[key];
        if (key == 'content') this.notes[indexOfElementToUpdate].content = newState[key]
      }
      // this.notes = this.notes.slice();
      // this.notes = JSON.parse(JSON.stringify(this.notes))
      // console.log(copy)
      // this.notes = copy.slice(0);
    } else {
      console.error(`${this.constructor.name}: element with id ${noteId} informed parent page about state change, but its id was not found in global object`)
    } 
  }

  
  addNewNoteIfInEditState($event: any){
    if (this.isInEditMode && !this.isAnyChildNoteInActiveState()) {
      this.newNoteIsAdded = true
      let newNote = this.storeManager.getNote(200, 200, $event.clientY, $event.clientX, '', true);
      newNote.isActive = true;
      this.notes.push(newNote);
    }
  }

  obliterateNote(id: string){
    this.notes.splice(this.findNoteById(id), 1);
  }

  findNoteById(id: string){
    let singleMatch = function(element: any) {
      return element.uniqueId === id
    }
    return this.notes.findIndex(singleMatch)
  }

  isAnyChildNoteInActiveState(){
    console.log(this.notes)
    let singleMatch = function(element:any){
      let a = element.isActive;
      // debugger
      return element.isActive == true
    };
    let a = this.notes.includes(singleMatch)
    return this.notes.findIndex(singleMatch) == -1?false:true;
    // return this.notes.includes(singleMatch)
  }

  changeNoteActiveState(data: any){
    let targetNote = this.notes[this.findNoteById(data.uniqueId)];
    targetNote.isActive = data.data;
  }

  deleteThisPage(){
    this.messenger.inform('killMe_page', {uniqueId: this.uniqueId, nrOfChidren: this.notes.length})
  }
  addAfterThisPage() {this.addPageAfterThisPageEvent.emit();}
  toggleEditMode() {this.isInEditMode = !this.isInEditMode}
  exitEditMode() {this.isInEditMode = false;}

  getUUIDTracker(index: number, item: any):any{
    return item.uniqueId
  }

  getPageWidth():string{
    let cssDerivedWidth = parseInt(this.elRef.nativeElement.offsetWidth);
    let notesDerivedWidth = this.getMostLeftPointOfPage(this.notes);
    return notesDerivedWidth > cssDerivedWidth ? notesDerivedWidth + 'px' : '';
  }

  getPageHeight():string{
    let cssDerivedHeight = parseInt(this.elRef.nativeElement.offsetHeight);
    let notesDerivedHeight = this.getMostTopPointOfPage(this.notes);
    return notesDerivedHeight > cssDerivedHeight ? notesDerivedHeight + 'px' : '';
  }


  getMostLeftPointOfPage(notesList: any[]){
    return this.getMostAwayPointOfPage(notesList, 'initialLeft', 'initialWidth');
  }

  getMostTopPointOfPage(notesList: any[]){
    return this.getMostAwayPointOfPage(notesList, 'initialTop', 'initialHeight');
  }

  getMostAwayPointOfPage(notesList: any[], position: 'initialLeft'|'initialTop', size: 'initialWidth' | 'initialHeight'){
    let biggestSoFar: number = 0;
    for (let note of notesList){
      let currentSum = note.position + note.size;
      if (currentSum > biggestSoFar) biggestSoFar = currentSum;
    }
    return biggestSoFar;
  }

}

