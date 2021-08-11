import { ResizeParentDirective } from './resize-parent.directive';
import {Component, DebugElement, ElementRef, ViewChild, HostListener,  CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, tick, fakeAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import { MovablePointComponent } from '../movable-point/movable-point.component'
import { ConstantPool } from '@angular/compiler';
import { ConcatSource } from 'webpack-sources';


@Component({
    selector: 'test-resize-component',
    template: ` 
        <div class = "playgronud">
            <div class="resizable-component-wrapper">
                <movable-point class="move" movableparent nestedLevel = '2'></movable-point>
                <div class = "content-placeholder"></div>
                <movable-point class="resize" resizeparent nestedLevel = '1'></movable-point>
              </div>
        </div>
    `,
    styles: [`
        .playgronud{
            position: relative;
            width: 150vw;
            height: 200vh;
        }
        .resizable-component-wrapper{
            position: absolute;
            border: solid thin blue;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .resize{
            align-self: right;
            position: relative;
            right: -25px;
            bottom: -25px;
            z-index: 100;
        }
        .move{
            position: relative;
        }
        .content-placeholder{
            width: 100%;
            height: calc(100% - 30px);
        }
    `]
})
class TestComponent {
    constructor(){}
}

class MockElementRef implements ElementRef{
        nativeElement = {offsetLeft: 0, offsetTop: 0};
}

describe('ResizeParentDirective', () => {
    let elementRef = new MockElementRef();
    let fixture: ComponentFixture<TestComponent>;
    let rootElementReference: HTMLElement;
    let movableElement: HTMLElement;
    let moveHandle: HTMLElement;
    let resizeHandle: HTMLElement;
    let internalElementThatMustResizeWithParent: HTMLElement;
    let positonBeforeMove: {x:number, y:number};
    let sizeBeforeResize: {w: number, h: number};


    beforeEach(async()=>{
        fixture = await TestBed.configureTestingModule({
            declarations: [TestComponent, MovablePointComponent, ResizeParentDirective],
            schemas:      [ CUSTOM_ELEMENTS_SCHEMA ]
          }).createComponent(TestComponent);
          fixture.detectChanges();
          rootElementReference = fixture.nativeElement.ownerDocument;
          movableElement = fixture.nativeElement.querySelector('.resizable-component-wrapper');
          moveHandle = fixture.nativeElement.querySelector('.move');
          resizeHandle = fixture.nativeElement.querySelector('.resize');
          internalElementThatMustResizeWithParent = fixture.nativeElement.querySelector('.content-placeholder');
          positonBeforeMove = getCurrentPosition();
    })

    function getCurrentPosition(){return {x: movableElement.offsetLeft, y: movableElement.offsetTop}}
    function getCurrentSize(){return {w: movableElement.offsetWidth, h: movableElement.offsetHeight}}
    function getInternalElementSize(){
        return {w: internalElementThatMustResizeWithParent.offsetWidth, h: internalElementThatMustResizeWithParent.offsetHeight}
    }

    function moveElementTo(x:number, y:number){
        let currentElementPosition = getCurrentPosition();
        alterElement(currentElementPosition, moveHandle, {x: x, y: y})
    }

    function resizeElement(w:number, h:number){
        let currentElementSize = getCurrentSize();
        alterElement({x: currentElementSize.w, y:currentElementSize.h}, resizeHandle, {x: w, y: h})
    }

    function alterElement(startPosition: {x:number, y:number}, handleElement: HTMLElement, endPosition:{x: number, y:number}){
        handleElement.dispatchEvent(new MouseEvent('mousedown', {clientX: startPosition.x, clientY: startPosition.y}))
        fixture.detectChanges();
        fixture.whenStable();
        rootElementReference.dispatchEvent(new MouseEvent('mousemove', {clientX: endPosition.x, clientY:endPosition.y}));
        fixture.detectChanges();
        fixture.whenStable();
        rootElementReference.dispatchEvent(new MouseEvent('mouseup', {clientX: endPosition.x, clientY: endPosition.y}))
        fixture.detectChanges();
        fixture.whenStable();        
    }

    function getExpectedSize(w: number, h: number) {return {w: w - positonBeforeMove.x, h: h - positonBeforeMove.y}}
    

  it('should create an instance', () => {
    const directive = new ResizeParentDirective(elementRef);
    expect(directive).toBeTruthy();
  });

  it('should resize parent element on handler mousedown, mousemove over body, mouseup over body', async()=>{
    resizeElement(200, 250);
    let sizeAfterChange = getCurrentSize();
    let expectedSize = getExpectedSize(200, 250);
    expect(sizeAfterChange).toEqual(expectedSize);
  })

  it('should resize parent element after element was moved', async()=>{

  })
  it('should resize parent after element was moved multiple times', async() => {

  })

  it('should resize nested content element after element was moved, element was resized', async()=>{

  })
});
