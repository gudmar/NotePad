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

  xit('', async () => {

  })
});
