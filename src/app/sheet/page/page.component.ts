import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
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
  set isInEditMode(val: boolean) {
    this._isInEditMode = val;
  }
  get isInEditMode() {return this._isInEditMode}
  @Input() uniqueId: string = '';
  @Input() bgColor: string = '';
  @Input() notes: any[] = [];
  @Output() deleteThisPageEvent: EventEmitter<string> = new EventEmitter();
  @Output() addPageAfterThisPageEvent: EventEmitter<string> = new EventEmitter();

  constructor(private messenger: CommunicationService, private storeManager: StorageManagerService) { }

  @HostListener('click', ['$event'])
  informThatThisPageWasClicked($event: any){
    this.messenger.inform('pageWasClicked', $event)
    $event.stopPropagation();
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
        'showAllNotes'
      ]
    );
  }

  reactToDataFromMessengar(eventType: string, data: any){
    if (eventType === 'noteWasMoved') {this.updateTargetNoteState(data.objectId, data)}
    if (eventType === 'noteWasResized') {this.updateTargetNoteState(data.objectId, data)}
    if (eventType === 'noteContentChanged') {this.updateTargetNoteState(data.objectId, data); console.log(data)}
    if (eventType === 'killMe') {this.obliterateNote(data);}
    if (eventType === 'noteWasClicked') {}
    if (eventType === 'showAllNotes') {
      this.messenger.inform('eachNoteShouldShow', '');
    }
    if (eventType === 'pageWasClicked') {
      this.addNewNoteIfInEditState(data)
    }
    console.log(`event ${eventType} received in page component `)
  }

  updateTargetNoteState(noteId: string, newState: {
          objectId: string, content?: string, newHeight?:number, newWidth?:number, pageX?:number, pageY?:number
        }){
    let that = this;
    let singleMatch = function(element: any){return element.uniqueId === noteId}
    let indexOfElementToUpdate = this.notes.findIndex(singleMatch);
    if (indexOfElementToUpdate != -1) {
      let keysToUpdate = Object.keys(newState);
      for (let key of keysToUpdate) {
        console.log(key)
        if (key == 'newWidth') this.notes[indexOfElementToUpdate].initialWidth = newState[key];
        if (key == 'newHeight') this.notes[indexOfElementToUpdate].initialHeight = newState[key];
        if (key == 'pageX') this.notes[indexOfElementToUpdate].initialLeft = newState[key];
        if (key == 'pageY') this.notes[indexOfElementToUpdate].initialTop = newState[key];
        if (key == 'content') this.notes[indexOfElementToUpdate].content = newState[key]
      }
      console.log(this.notes)
    } else {
      console.error(`${this.constructor.name}: element with id ${noteId} informed about state change, but it was not found`)
    } 
  }

  
  addNewNoteIfInEditState($event: any){
    if (this.isInEditMode && !this.areAllChidNotesInActiveState()) {
      let newNote = this.storeManager.getNote(200, 200, $event.clientY, $event.clientX, '', true);
      this.notes.push(newNote);
      
      console.log(this.notes[this.notes.length - 1])
      console.dir($event)
      // Object.values(this.notes[this.notes.length])[0].isActive = true;
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

  areAllChidNotesInActiveState(){
    let singleMatch = function(element:any){return element.Values[0].isActive == true};
    return this.notes.includes(singleMatch)
  }

  deleteThisPage(){
    this.messenger.inform('killMe_page', {uniqueId: this.uniqueId, nrOfChidren: this.notes.length})
  }
  addAfterThisPage() {this.addPageAfterThisPageEvent.emit();}
  toggleEditMode() {this.isInEditMode = !this.isInEditMode}
  exitEditMode() {this.isInEditMode = false;}

  getUUIDTracker(index: number, item: any):any{
    // debugger
    return item.uniqueId
  }

}

// (deleteMe) = "deleteThisPage()"
// (addAfterMe) = "addAfterThisPage()"
// (editMode) = "enterEditMode()"
// (exitEditMode) = "exitEditMode()"
