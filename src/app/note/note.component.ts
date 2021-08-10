import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  thisElement: ElementRef;
  constructor(thisElement: ElementRef) { 
    this.thisElement = thisElement;
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
