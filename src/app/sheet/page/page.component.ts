import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NoteComponent } from '../../note/note.component'
import { CommunicationService } from '../../services/communication.service';

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

  constructor(private messenger: CommunicationService) { }

  ngOnInit(): void {
    this.messenger.subscribe(this.uniqueId, 
      this.reactToDataFromMessengar.bind(this), 
      ['noteWasMoved', 'noteWasResized', 'noteContentChanged', 'killMe']
    );
  }

  reactToDataFromMessengar(eventType: string, data: any){
    if (eventType === 'noteWasMoved') {this.updateTargetNoteState(data.objectId, data)}
    if (eventType === 'noteWasResized') {this.updateTargetNoteState(data.objectId, data)}
    if (eventType === 'noteContentChanged') {this.updateTargetNoteState(data.objectId, data); console.log(data)}
    if (eventType === 'killMe') {this.obliterateNote(data); console.log('HEREHERHERH')}
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

  obliterateNote(id: string){
    this.notes.splice(this.findNoteById(id), 1);
  }

  findNoteById(id: string){
    let singleMatch = function(element: any) {
      return element.uniqueId === id
    }
    return this.notes.findIndex(singleMatch)
  }

  deleteThisPage(){this.deleteThisPageEvent.emit();}
  addAfterThisPage() {this.addPageAfterThisPageEvent.emit();}
  enterEditMode() {this.isInEditMode = true}
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
