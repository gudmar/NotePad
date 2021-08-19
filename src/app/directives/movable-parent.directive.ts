import { Directive, ElementRef, HostListener, Input, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[movableparent]'
})
export class MovableParentDirective {
  @Input('nestedLevel') nestedLevel:number = 0;
  @Input('initialTop') initialTop: number = 0;
  @Input('initialLeft') initialLeft: number = 0;
  @Input('movableElementId') movableElementId: string = ''; 
  @Output() elementMoved: EventEmitter<{movedElementId: string, pageX: number, pageY:number}> = new EventEmitter();
  elRef: ElementRef;
  elementToMove: HTMLElement;
  isInMoveState: boolean = false;
  clickOffset = {x: 0, y: 0};  
  constructor(elRef: ElementRef) { 
    this.elRef = elRef;
    this.elementToMove = this.getElementToMove();
  }


  @HostListener('mousedown', ['$event'])
  activateMoveMode(event: MouseEvent){
    this.isInMoveState = true;
    let elementToMoveOffset = {x: this.elementToMove.offsetLeft, y: this.elementToMove.offsetTop};
    this.clickOffset = {x: event.pageX - elementToMoveOffset.x, y:event.pageY - elementToMoveOffset.y}

  }

  @HostListener('document:mouseup', ['$event'])
  disacitvateMoveMode(event: MouseEvent){
    this.isInMoveState = false;
    this.dispatchEventOnMovedElement({pageX: event.pageX, pageY: event.pageY})
  }

  @HostListener('document:mousemove', ['$event'])
  doMouseMove(data: any){
    if (this.isInMoveState) {
      let newCords = this.calculateNewPosition({x: data.pageX, y: data.pageY})
      let correctedPosition = this.calculateNewPosition({x: data.pageX, y: data.pageY});
      this.elementToMove.style.left = correctedPosition.x + 'px';
      this.elementToMove.style.top = correctedPosition.y + 'px';
      // debugger
    }
  } 


  dispatchEventOnMovedElement(data: {pageX: number, pageY: number}){
    let eventData = {
      movedElementId: this.movableElementId,
      pageX: data.pageX,
      pageY: data.pageY
    }
    this.elementMoved.emit(eventData)
  }

  getElementToMove(){
    let elementToMove = this.elRef.nativeElement;
    for(let i = 0; i < this.nestedLevel; i++){
      elementToMove = elementToMove.parentElement;
    }
    return elementToMove;
  }

  calculateNewPosition(cordsFromEvent: {x: number, y: number}){
    let elementToMoveOffset = {x: this.elRef.nativeElement.offsetLeft, y: this.elRef.nativeElement.offsetTop};
    let offset = this.clickOffset;
    return {x: cordsFromEvent.x - offset.x, y: cordsFromEvent.y - offset.y}
  }

  ngOnInit(){
    this.elementToMove = this.getElementToMove();
    this.isInMoveState = true;
    this.doMouseMove({pageX: this.initialLeft, pageY: this.initialTop});
    // debugger;
    this.isInMoveState = false;
  }
}
