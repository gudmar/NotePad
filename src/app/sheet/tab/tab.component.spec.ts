import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {Component, DebugElement, ViewChild, HostListener,  CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { TabComponent } from './tab.component';

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;
  let shapeElement: HTMLElement;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    shapeElement = fixture.nativeElement.querySelector('.tab-shape');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should launch an event when clicked', fakeAsync(()=>{
    let eventWasLaunched = false;
    fixture.componentInstance.uniqueId = 'someID'
    spyOn(component, 'onThisTabSelect')
    fixture.nativeElement.click();
    expect(component.onThisTabSelect).toHaveBeenCalled();
  }))
  it('Should change color on bgColor property change', ()=> {
    let getCurrentBGcolor = function(){
      return window.getComputedStyle(shapeElement).borderBottomColor
    }
    fixture.detectChanges();
    expect(getCurrentBGcolor()).toBe('rgb(255, 255, 255)')
    component.bgColor = 'green';
    fixture.detectChanges();
    expect(getCurrentBGcolor()).toBe('rgb(0, 128, 0)')
    
  })

  it('Should change title, after title property changed', ()=>{
    let getTitle = function(){return shapeElement.innerText}
    let newTitleForTests = "Some other title";
    fixture.detectChanges();
    expect(getTitle()).toBe('newTab');
    component.tabTitle = newTitleForTests;
    fixture.detectChanges();
    expect(getTitle()).toBe(newTitleForTests);
  })

});