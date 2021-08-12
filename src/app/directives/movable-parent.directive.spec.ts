import { MovableParentDirective } from './movable-parent.directive';
import {Component, DebugElement, ElementRef, ViewChild, HostListener,  CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, tick, fakeAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import { MovablePointComponent } from '../movable-point/movable-point.component'
import { ConstantPool } from '@angular/compiler';
import { ConcatSource } from 'webpack-sources';

@Component(
    {
      selector: 'test-component-wrapper',
      template: `
      <div class = "wrapper">
        <div class = "this-should-be-moved">
            <div class = "add-nested-level">
                <div class = "add-nested-level">
                    <movable-point movableparent [nestedLevel] = "4" id="grabThisToMoveParent"></movable-point>
                </div>
            </div>
        </div>
      </div>
      `,
      styles: [`
        .wrapper{
          position: relative;
          width: 200vw;
          height: 200vh;
        }
        .this-should-be-moved{
            position: absolute;
            width: 50px;
            height: 50px;
            background-color: gray;
        }
        .add-nested-level{
            position: relative;
            width: 100%;
            height: 100%;
        }
      `]
    })
  
    class TestComponent{
  
      constructor(){};
  
  
    }
  
  
    class MockElementRef implements ElementRef {
      nativeElement = {offsetLeft: 0, offsetTop: 0};
    }


xdescribe('MovableParentDirective', () => {
    let testComponent: TestComponent;
    let fixture: ComponentFixture<TestComponent>
    let elementThatShouldBeMoved: HTMLElement;
    let movingHandle: HTMLElement;
    let testZoneDocumentReference: HTMLElement;
    let positionOfNotMovedElement: {x: number, y: number};
    let getCurrentPosition = function() {return {clientX: elementThatShouldBeMoved.offsetLeft, clientY: elementThatShouldBeMoved.offsetTop}}
    let getMovementDelta = function(stepX: number, stepY:number) {return {clientX: stepX, clientY: stepY}}
    let makeMoveAsym = function(stepX: number, stepY: number){
        movingHandle.dispatchEvent(new MouseEvent('mousedown', getCurrentPosition()));
        fixture.detectChanges();
        fixture.whenStable();
        testZoneDocumentReference.dispatchEvent(new MouseEvent('mousemove', getMovementDelta(stepX, stepY)))
        fixture.detectChanges();
        fixture.whenStable();
        testZoneDocumentReference.dispatchEvent(new MouseEvent('mouseup', getMovementDelta(stepX, stepY)))
        fixture.detectChanges();
        fixture.whenStable();       
    }
    let makeMove = function(step: number){
        makeMoveAsym(step, step);
    }
  
      beforeEach(async () => {
      fixture = await TestBed.configureTestingModule({
        declarations: [TestComponent, MovablePointComponent, MovableParentDirective],
        schemas:      [ CUSTOM_ELEMENTS_SCHEMA ]
      }).createComponent(TestComponent);
      fixture.detectChanges();
      elementThatShouldBeMoved = fixture.nativeElement.querySelector('.wrapper');
      movingHandle = fixture.nativeElement.querySelector('movable-point');
      testZoneDocumentReference = fixture.nativeElement.ownerDocument;
      positionOfNotMovedElement = {x: elementThatShouldBeMoved.offsetLeft, y: elementThatShouldBeMoved.offsetTop};
    });

  it('should create an instance', () => {
    let elRef: ElementRef = new MockElementRef();
    const directive = new MovableParentDirective(elRef);
    expect(directive).toBeTruthy();
  });

  it('should move parent element on mousedown, mousemove, mouseup, handler is 3 levels nested', async()=>{
    makeMove(100);
    let positionAfterMovement = getCurrentPosition();
    expect({x: positionAfterMovement.clientX, y: positionAfterMovement.clientY})
            .toEqual({x: 100 + positionOfNotMovedElement.x, y: 100 + positionOfNotMovedElement.y});
  })

  it('Should have proper position after moving 10 times in a raw', async() =>{
    let moveAndCheck = function(step: number){
        makeMove(step);
        let positionAfterMovement = getCurrentPosition();         
        expect({x: positionAfterMovement.clientX, y: positionAfterMovement.clientY})
                .toEqual({x: step + positionOfNotMovedElement.x, y: step + positionOfNotMovedElement.y});            
    }
    let steps = [50, 25, 10, 53, 10, 22, 67, 99, 444, 500]
    for (let step of steps){
        moveAndCheck(step);
    }            
  })

  it('Should have a proper position after moving a few times in raw with pageX != pageY', async()=>{
    let moveAndCheck = function(stepX: number, stepY: number){
        makeMoveAsym(stepX, stepY);
        let positionAfterMovement = getCurrentPosition();         
        expect({x: positionAfterMovement.clientX, y: positionAfterMovement.clientY})
                .toEqual({x: stepX + positionOfNotMovedElement.x, y: stepY + positionOfNotMovedElement.y});            
    }
    let steps = [[50, 0], [0, 25], [5, 10], [53, 200], [10, 220], [67, 99], [99, 67], [444, 45], [500, 300]];
    for (let step of steps){
        moveAndCheck(step[0], step[1]);
    }       
  })
});
