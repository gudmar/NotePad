import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { MovableParentDirective } from './movable-parent.directive';
import { ConstantPool } from '@angular/compiler';

@Directive({
  selector: '[ResizeParent]'
})
export class ResizeParentDirective extends MovableParentDirective{
  @Input('minWidth') minWidth: number = 50;
  @Input('minHeight') minHeight: number = 50;
  resizeDotOffset:{x:number, y:number} = {x:0, y:0}
  movableParentTopLeftCords: {x: number, y: number} = {x: 0, y: 0};
  constructor(elRef: ElementRef) { 
    super(elRef);
  }

  @HostListener('mousedown', ['$event'])
  calculateDotOffset(data:any){
    this.resizeDotOffset = {x: data.pageX - this.elRef.nativeElement.offsetLeft - this.elementToMove.offsetLeft, 
                            y: data.pageY - this.elRef.nativeElement.offsetTop - this.elementToMove.offsetTop}
  }

  @HostListener('document:mouseMove', ['$event'])
  doMouseMove(data:any){
    let that = this;
    let calculatedSize = function(){
      let width = data.pageX - parentOffset.x - that.resizeDotOffset.x; 
      let height = data.pageY - parentOffset.y - that.resizeDotOffset.y;
      return {width: width < that.minWidth ? that.minWidth : width, height: height < that.minHeight ? that.minHeight : height}
    }
    let parentOffset = {x: this.elementToMove.offsetLeft, y: this.elementToMove.offsetTop}
    
    

    if (this.isInMoveState) {
      let newCords = this.calculateNewPosition({x: data.pageX, y: data.pageY})
      let correctedPosition = this.calculateNewPosition({x: data.pageX, y: data.pageY});
      this.elementToMove.style.width = calculatedSize().width + 'px';
      this.elementToMove.style.height = calculatedSize().height + 'px';
    }
  }

}
