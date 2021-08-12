import { Directive, ElementRef, HostListener, Input, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[movableparent]'
})
export class MovableParentDirective {
  @Input('nestedLevel') nestedLevel:number = 0;
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
  }
}
