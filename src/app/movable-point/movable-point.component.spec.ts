import { ComponentFixture,   TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MovablePointComponent } from './movable-point.component';
import { MovableDirective } from '../directives/movable.directive'

import { ElementRef } from '@angular/core';


class MockElementRef implements ElementRef {
  nativeElement = {offsetLeft: 0, offsetTop: 0};
}

xdescribe('MovablePointComponent', () => {
  let component: MovablePointComponent;
  let fixture: ComponentFixture<MovablePointComponent>;
  let testedComponent: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovablePointComponent, MovableDirective ],
      providers: [{provide: MockElementRef}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovablePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testedComponent = fixture.nativeElement.querySelector('movable-point');
    console.log('testedComponet')
    console.log(testedComponent)
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be moved when mousue down and mousemove', async () => {
    console.log( 'fixture, comonentInstance')
    testedComponent = fixture.componentInstance
    let elRef = testedComponent.elRef.nativeElement
    console.log(fixture.componentInstance)   // A way to get tested componet
    console.log(fixture.debugElement.query(By.css('*')))
    let startPosition = {x: elRef.offsetLeft, y: elRef.offsetTop};
    fixture.debugElement.triggerEventHandler('mousedown', {});
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.debugElement.triggerEventHandler('mousemove', {pageX: 100, pageY: 100});
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.debugElement.triggerEventHandler('mouseup', {});
    fixture.detectChanges();
    await fixture.whenStable();
    
    testedComponent = fixture.componentInstance;
    
    // testedComponent.triggerEventHandler('mousedown', {});
    // testedComponent.triggerEventHandler('mousemove', {pageX: 100, pageY: 100});
    let endPositionExpected = {x: startPosition.x + 100, y: startPosition.y + 100};
    let endPositionInReality = {x: elRef.offsetLeft, y: elRef.offsetTop}
    debugger;
    console.log(startPosition)
    console.log(endPositionExpected)
    console.log(endPositionInReality)
    await expect(endPositionExpected).toBe(endPositionInReality);
  })
});
