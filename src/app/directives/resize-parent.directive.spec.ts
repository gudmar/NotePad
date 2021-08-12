import { ResizeParentDirective } from './resize-parent.directive';
import { MovableParentDirective} from './movable-parent.directive';
import {Component, DebugElement, ElementRef, ViewChild, HostListener,  CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, tick, fakeAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import { MovablePointComponent } from '../movable-point/movable-point.component'
import { ConstantPool } from '@angular/compiler';
import { ConcatSource } from 'webpack-sources';
import { start } from 'repl';


// <movable-point class="resize" resizeparent nestedLevel = '1'></movable-point>
// <div class="resize" resizeparent nestedLevel = '1'></div>
@Component({
    selector: 'test-resize-component',
    template: ` 
        <div class = "playgronud">
            <div class="resizable-component-wrapper" (click) = "getEventData($event)">
                <movable-point class="move" movableparent nestedLevel = '1'></movable-point>
                <div class = "content-placeholder"></div>
                <movable-point class="resize" resizeparent nestedLevel = '1'></movable-point>
              </div>
        </div>
    `,
    styles: [`

        .playgronud{
            position: relative;
            top: 0px;
            left: 0px;
            width: 150vw;
            height: 200vh;
        }
        .resizable-component-wrapper{
            position: absolute;
            background-color: rgb(220, 220, 220);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .resize{
            box-sizing: border-box;
            
            align-self: flex-end;
            
            right: -25px;
            bottom: -25px;
            z-index: 100;
        }
        .resize-B{
            box-sizing: border-box;
            position: relative;
            width: 10px;
            height: 10px;
            right: -10px;
            bottom: -10px;
            border-radius: 50%;
            background-color: green;

        }
        .move{
            position: relative;
        }
        .content-placeholder{
            width: 100%;
            height: calc(100% - 30px);
            background-color: rgb(200, 200, 230);
        }
    `]
})
class TestComponent {
    eventData: any;
    constructor(){
        this.eventData = {};
    }
    getEventData(data:any){
        console.log('event data written')
        this.eventData = data;
    }
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
            declarations: [TestComponent, MovablePointComponent, ResizeParentDirective, MovableParentDirective],
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
        let currentElementPosition = getCurrentPosition();
        let startPosition = {x: currentElementSize.w + currentElementPosition.x, y:currentElementSize.h + currentElementPosition.y}
        alterElement(startPosition, resizeHandle, {x: w, y: h})
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
    
    function getCordsRelativeToResizingHandle(pageCords:{x: number, y: number}){
        let currentMovablePosition = getCurrentPosition();
        let resizeHandleOffset = {x: resizeHandle.offsetLeft, y: resizeHandle.offsetHeight};
        let offset = {x: currentMovablePosition.x + resizeHandleOffset.x, y: currentMovablePosition.y + resizeHandleOffset.y}
        return {x: pageCords.x - offset.x, y: pageCords.y - offset.y}
    }

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
      
    moveElementTo(130, 200);
    movableElement.dispatchEvent(new MouseEvent('click', {clientX: getCurrentPosition().x, clientY: getCurrentPosition().y}));
    let positionAfterMovement = getCurrentPosition();
    resizeElement(300, 350);
    let sizeAfterChange = getCurrentSize();
    let expectedSize = getExpectedSize(300 - 130, 350 -200);
    expect(positionAfterMovement).toEqual({x: 130, y: 200})
    expect(sizeAfterChange).toEqual(expectedSize);
  })

  it('should resize parent a couple times', async() => {
    let transformationArray = [
        {resizeTo: {x: 350, y: 300}},
        {resizeTo: {x: 350, y: 300}},
        {resizeTo: {x: 350, y: 300}},

    ]
    let singleTransformationAndCheck = function(transformationDescriptor: any){
        let expectedSize = getExpectedSize(
            transformationDescriptor.resizeTo.x, 
            transformationDescriptor.resizeTo.y
        )
        let positionAfterMovement = getCurrentPosition();

        resizeElement(transformationDescriptor.resizeTo.x, transformationDescriptor.resizeTo.y);
        let sizeAfterChange = getCurrentSize();
        expect(sizeAfterChange).toEqual(expectedSize);
    }
    transformationArray.forEach(singleTransformationAndCheck);
  })

  it('should resize parent multiple times after element was moved multiple times', async() => {
    let transformationArray = [
        {moveTo: {x: 200, y: 130}, resizeTo: {x: 350, y: 300}},
        {moveTo: {x: 200, y: 130}, resizeTo: {x: 350, y: 300}},
        {moveTo: {x: 200, y: 130}, resizeTo: {x: 350, y: 300}},
        {moveTo: {x: 100, y: 30}, resizeTo: {x: 350, y: 300}},
        {moveTo: {x: 110, y: 40}, resizeTo: {x: 350, y: 300}},
        {moveTo: {x: 120, y: 50}, resizeTo: {x: 350, y: 300}},
    ]
    let singleTransformationAndCheck = function(transformationDescriptor: any){
        let positionBeforeTransformation = getCurrentPosition();
        let expectedSize = getExpectedSize(
            transformationDescriptor.resizeTo.x - transformationDescriptor.moveTo.x, 
            transformationDescriptor.resizeTo.y - transformationDescriptor.moveTo.y
        )
        moveElementTo(transformationDescriptor.moveTo.x, transformationDescriptor.moveTo.y);
        let positionAfterMovement = getCurrentPosition();
        resizeElement(transformationDescriptor.resizeTo.x, transformationDescriptor.resizeTo.y);
        let sizeAfterChange = getCurrentSize();
        // if (transformationDescriptor.moveTo.y == 30) debugger;
        expect(positionAfterMovement).toEqual(transformationDescriptor.moveTo);
        expect(sizeAfterChange).toEqual(expectedSize);
    }
    transformationArray.forEach(singleTransformationAndCheck);
  })

  it('should resize nested content element after element was moved, element was resized', async()=>{

  })
});


// Problem leźy w komponentcie movable-point. Zmieniana jest clientHeight  chyba movable-point z 25 na 23!!. Jak widać po zastąpieniu prostrzym 
// elementem działa.
