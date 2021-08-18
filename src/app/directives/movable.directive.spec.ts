import { MovableDirective } from './movable.directive';
import {Component, DebugElement, ElementRef, ViewChild, HostListener,  CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, tick, fakeAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import { MovablePointComponent } from '../movable-point/movable-point.component'
import { ConstantPool } from '@angular/compiler';
import { ConcatSource } from 'webpack-sources';



// https://medium.com/simars/testing-directives-with-test-components-26c266308620

@Component(
  {
    selector: 'test-component-wrapper',
    template: `
    <div class = "wrapper">
      <movable-point movableelement></movable-point>
    </div>
    `,
    styles: [`
      .wrapper{
        position: relative;
        width: 200vw;
        height: 200wh;
      }
    `]
  })

  class TestComponent{

    constructor(){};


  }


  class MockElementRef implements ElementRef {
    nativeElement = {offsetLeft: 0, offsetTop: 0};
  }



xdescribe('MovableDirective', () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>
  let dummyBody: HTMLElement


    beforeEach(async () => {
      // dummyBody = getDummyBody();
    fixture = await TestBed.configureTestingModule({
      declarations: [TestComponent, MovablePointComponent, MovableDirective],
      schemas:      [ CUSTOM_ELEMENTS_SCHEMA ]
    }).createComponent(TestComponent);
    fixture.detectChanges()
  });


  it('should create an instance', () => {
    const mockRef = new MockElementRef();
    const directive = new MovableDirective(mockRef);
    expect(directive).toBeTruthy();
  });


  it('should move object after mousedown, mousemove, mouseup', fakeAsync(()=> {
    const dE: DebugElement = fixture.debugElement;
    fixture.nativeElement.dispatchEvent(new Event('mousedown'));
    const movableElement = fixture.nativeElement.querySelector('movable-point')
    let startPosition = {x: movableElement.offsetLeft, y: movableElement.offsetTop};
    // movableElement.nativeElement.click()
    fixture.detectChanges();
    fixture.whenStable();
    
    movableElement.dispatchEvent(new MouseEvent('mousedown'), {clientX: 0, clientY: 0})
    fixture.detectChanges();
    fixture.whenStable();

    fixture.nativeElement.ownerDocument.dispatchEvent(new MouseEvent('mousemove', {clientX: 100, clientY: 100}));
    fixture.detectChanges();
    fixture.whenStable();

    fixture.nativeElement.ownerDocument.dispatchEvent(new MouseEvent('mouseup', {clientX: 100, clientY: 100}));
    fixture.detectChanges();
    fixture.whenStable();

    let endPositionExpected = {x: startPosition.x + 100, y: startPosition.y + 100};
    let endPositionInReality = {x: movableElement.offsetLeft, y: movableElement.offsetTop}
    expect(endPositionExpected).toEqual(endPositionInReality);


  }))
});
