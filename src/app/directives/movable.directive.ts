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
      
      // this.objectToMove = elRef.nativeElement.parent
      this.left = this.elRef.nativeElement.offsetLeft;
      this.top = this.elRef.nativeElement.offsetTop;
    }

    @HostListener('mousedown', ['$event'])
  activateMoveMode(event: MouseEvent){
    console.log('mouse down')
    this.isInMoveState = true;
    let elementsCords = {x: this.elRef.nativeElement.offsetLeft, y: this.elRef.nativeElement.offsetTop};
    this.clickOffset = {x: event.pageX - elementsCords.x, y:event.pageY - elementsCords.y}

  }

  @HostListener('click', ['$event'])
  onClick(data:any){
    // debugger;
    console.log('movable directie  - click event passed')
  }

  @HostListener('document:mouseup', ['$event'])
  disacitvateMoveMode(event: MouseEvent){
    console.log('movable directive mouseup passed')
    this.isInMoveState = false;
  }

  @HostListener('document:mousemove', ['$event'])
  changeElementsPosition(data: any){
    console.log('I am in mousemove')
    if (this.isInMoveState) {
      console.log('I am i mouse  move and state is true')
      let newCords = this.calculateNewPosition({x: data.pageX, y: data.pageY})
      this.elRef.nativeElement.style.left = newCords.x + 'px';
      this.elRef.nativeElement.style.top = newCords.y + 'px';
    }
  }  

  calculateNewPosition(cordsFromEvent: {x: number, y: number}){
    let elementsCords = {x: this.elRef.nativeElement.offsetLeft, y: this.elRef.nativeElement.offsetTop};
    // let offset = {x: cordsFromEvent.x - elementsCords.x, y: cordsFromEvent.y - elementsCords.y}
    let offset = this.clickOffset;
    return {x: cordsFromEvent.x - offset.x, y: cordsFromEvent.y - offset.y}
  }
}

