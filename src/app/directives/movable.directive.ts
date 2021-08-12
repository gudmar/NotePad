import { Directive, ElementRef, HostListener, Input, EventEmitter, Output} from '@angular/core';

@Directive({
  selector: '[movableelement]'
})
export class MovableDirective {
    elRef: ElementRef;
    left:number;
    top: number;
    isInMoveState: boolean = false;
    clickOffset = {x: 0, y: 0};  
    constructor(elRef: ElementRef) { 
      this.elRef = elRef;
      
      this.left = this.elRef.nativeElement.offsetLeft;
      this.top = this.elRef.nativeElement.offsetTop;
    }

    @HostListener('mousedown', ['$event'])
  activateMoveMode(event: MouseEvent){
    this.isInMoveState = true;
    let elementsCords = {x: this.elRef.nativeElement.offsetLeft, y: this.elRef.nativeElement.offsetTop};
    this.clickOffset = {x: event.pageX - elementsCords.x, y:event.pageY - elementsCords.y}

  }

  @HostListener('click', ['$event'])
  onClick(data:any){
  }

  @HostListener('document:mouseup', ['$event'])
  disacitvateMoveMode(event: MouseEvent){
    this.isInMoveState = false;
  }

  @HostListener('document:mousemove', ['$event'])
  changeElementsPosition(data: any){
    if (this.isInMoveState) {
      let newCords = this.calculateNewPosition({x: data.pageX, y: data.pageY})
      this.elRef.nativeElement.style.left = newCords.x + 'px';
      this.elRef.nativeElement.style.top = newCords.y + 'px';
    }
  }  

  calculateNewPosition(cordsFromEvent: {x: number, y: number}){
    let elementsCords = {x: this.elRef.nativeElement.offsetLeft, y: this.elRef.nativeElement.offsetTop};
    let offset = this.clickOffset;
    return {x: cordsFromEvent.x - offset.x, y: cordsFromEvent.y - offset.y}
  }
}

