import { Component, OnInit, EventEmitter, Output, Input, Host, ViewChild, ElementRef } from '@angular/core';
import { CommunicationService } from '../services/communication.service'

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  // providers: [CommunicationService]
})
export class NoteComponent implements OnInit {
  @Input() initialWidth: number = 100;
  @Input() initialHeight: number = 100;
  @Input() initialTop: number = 30;
  @Input() initialLeft: number = 30;
  @Input() content: string = '';
  @Input() uniqueId: string = '';
  @Output() noteWasMoved: EventEmitter<any> = new EventEmitter();
  @Output() noteWasResized: EventEmitter<any> = new EventEmitter();
  @Output() noteContentChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('contentHolder') contentHolder: any;
  constructor(private messenger: CommunicationService) { }

  informAboutMovement(data: any){
    this.noteWasMoved.emit(data)
    this.messenger.inform('noteWasMoved', {
      objectId: this.uniqueId,
      pageX: data.pageX,
      pageY: data.pageY
    })
  }

  informAboutResize(data: any){
    this.noteWasResized.emit(data);
    this.messenger.inform('noteWasResized', {
      objectId: this.uniqueId,
      newWidth: data.width,
      newHeight: data.height
    })
  }

  informAboutContentChange(data: any){
    this.noteContentChanged.emit(data);
    console.dir(this.contentHolder)
    this.messenger.inform('noteContentChanged', {
      objectId: this.uniqueId,
      content: this.contentHolder.nativeElement.innerHTML
    })
  }

  moveThisNote(data: any){
    // console.log(this.thisElement)
    // // let positionOffset = {x: this.thisElement.nativeElement.offsetLeft, y: this.thisElement.nativeElement.offsetTop};
    // console.log(data.x)
    // this.thisElement.nativeElement.style.left =  data.x + "px";
    // this.thisElement.nativeElement.style.top  = data.y + "px";
  }

  // calculateNewPosition(cordsFromEvent: {x: number, y: number}){
  //   let elementsCords = {x: this.thisElement.nativeElement.offsetLeft, y: this.thisElement.nativeElement.offsetTop};
  //   // let offset = {x: cordsFromEvent.x - elementsCords.x, y: cordsFromEvent.y - elementsCords.y}
  //   let offset = this.clickOffset;
  //   return {x: cordsFromEvent.x - offset.x, y: cordsFromEvent.y - offset.y}
  // }

  ngOnInit(): void {
  }

}
