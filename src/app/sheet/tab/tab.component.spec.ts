import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Input, Output, Component, DebugElement, ViewChild, HostListener,  CUSTOM_ELEMENTS_SCHEMA, TestabilityRegistry} from '@angular/core';
import { TabComponent } from './tab.component';
import { Observable, of } from 'rxjs';



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

  xit('Should return components uniqueId after element is clicked', async()=>{
    // I found no material how to test this scenario. Not found possibility to test if event provides needed data. 
    // 1. After simulatin click, this event is not discovered by addEventListener
    // 2. Adding an extra component, that would wrapp tested componet does no good:

    //   a) Need to reconfigure TesetBed after it was done in afterEach, and configuration of TestBed in it block brings error
    //   b) Testing everythin with a wrapping element will not test if initial values of inputs were set correctly

    // Funcitonality, if event returns a proper value can be tested in parent comopnet Tests. Not the cleanest solution, but 
    // functionality is covered
    let returnedId = '';
    let setId = function(data: any){
      console.log('setId data from event')
      console.log(data)
      returnedId = data
    }
    component.uniqueId = 'someId'
    fixture.detectChanges();
    fixture.nativeElement.addEventListener('tabChosen', setId)
    fixture.nativeElement.click();
    component.tabChosen.emit(component.uniqueId)
    fixture.detectChanges();
    expect(returnedId).toBe('someId')
  })
  



});