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
  doNotInformAboutChanges: boolean = false;
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
    if (this.isInMoveState){
      this.dispatchEventOnMovedElement({pageX: event.pageX, pageY: event.pageY})
      this.isInMoveState = false;  
    }
  }

  @HostListener('document:mousemove', ['$event'])
  doMouseMove(data: any){
    if (this.isInMoveState) {
      let newCords = this.calculateNewPosition({x: data.pageX, y: data.pageY})
      let correctedPosition = this.calculateNewPosition({x: data.pageX, y: data.pageY});
      this.elementToMove.style.left = correctedPosition.x + 'px';
      this.elementToMove.style.top = correctedPosition.y + 'px';
    }
  } 

  setInitialPosition(position:{pageX: number, pageY: number, [prop: string]: any}){
    let that = this
    let correct = function(p:{x:number, y:number}){
      let dx = p.x - that.elementToMove.offsetLeft;
      let dy = p.y - that.elementToMove.offsetTop;
      return {x: p.x - dx, y: p.y -dy}
    }
    this.elementToMove.style.left = position.pageX + 'px';
    this.elementToMove.style.top = position.pageY + 'px';
    let positionBeforeCorrection = this.getElementsAbsolutePosition(this.elementToMove)
    console.log({x: position.pageX, y: position.pageY})
    console.log(positionBeforeCorrection)
    let delta = {x: position.pageX - positionBeforeCorrection.x, y: position.pageY - positionBeforeCorrection.y}
    console.log(delta)
    let positionCorrectedWithInternalOffset = correct({x: position.pageX + delta.x, y: position.pageY + delta.y})
    this.elementToMove.style.left = positionCorrectedWithInternalOffset.x + 'px';
    this.elementToMove.style.top = positionCorrectedWithInternalOffset.y + 'px';
    // this.elementToMove.style.left = position.pageX + delta.x + 'px';
    // this.elementToMove.style.top  = position.pageY + delta.y + 'px';
  }


  dispatchEventOnMovedElement(data: {pageX: number, pageY: number}){
    let eventData = {
      movedElementId: this.movableElementId,
      pageX: data.pageX,
      pageY: data.pageY
    }
    if (!this.doNotInformAboutChanges) this.elementMoved.emit(eventData)
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

  getElementsAbsolutePosition(element: HTMLElement){
    let scrollTop = window.pageYOffset;
    let scrollLeft = window.pageXOffset;
    let positionRelativeToViewport = element.getBoundingClientRect();
    return {x: scrollTop + positionRelativeToViewport.left, y: scrollLeft + positionRelativeToViewport.top }
  }

  ngOnInit(){
    // this.doNotInformAboutChanges = true;
    this.elementToMove = this.getElementToMove();
    this.setInitialPosition({pageX: this.initialLeft, pageY: this.initialTop});
    // this.isInMoveState = true;
    // this.doMouseMove({pageX: this.initialLeft, pageY: this.initialTop});
    // // debugger;
    // this.isInMoveState = false;
    // this.doNotInformAboutChanges = false;
  }
}
