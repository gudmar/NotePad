import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Input, Output, Component, DebugElement, ViewChild, HostListener,  CUSTOM_ELEMENTS_SCHEMA, TestabilityRegistry} from '@angular/core';
import { TabComponent } from './tab.component';
import { Observable, of } from 'rxjs';



xdescribe('TabComponent', () => {
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

  it('Should get active class after being clicked', ()=>{
    component.isActive = false;
    fixture.detectChanges();
    let classes = fixture.nativeElement.querySelector('.tab-shape').classList;
    expect(classes).not.toContain('active')
    component.isActive = true;
    fixture.detectChanges();
    classes = fixture.nativeElement.querySelector('.tab-shape').classList;
    expect(classes).toContain('active')
  })

  it('Should launch an event when clicked', fakeAsync(()=>{
    fixture.componentInstance.uniqueId = 'someID'
    spyOn(component, 'onThisTabSelect')
    fixture.nativeElement.click();
    expect(component.onThisTabSelect).toHaveBeenCalled();
  }))

  xit('Should change color on bgColor property change', async()=> {
    let getCurrentBGcolor = function(){
      // console.log(JSON.stringify(window.getComputedStyle(shapeElement).borderBottomColor))
      return window.getComputedStyle(shapeElement).borderBottomColor
    }
    fixture.detectChanges();
    expect(getCurrentBGcolor()).toBe('rgb(255, 255, 255)')
    component.bgColor = 'red';
    fixture.detectChanges();
    expect(component.bgColor).toBe('red')
    // debugger
    component.tabTitle = 'some t';
    fixture.detectChanges();
  
    let color = window.getComputedStyle(shapeElement).borderBottomColor
    // console.log(`Color after change is ${color}`)
    expect(getCurrentBGcolor()).toBe('rgb(255, 0, 0)')
    
  })

  it('Should change title, after title property changed', ()=>{
    let getTitle = function(){return fixture.nativeElement.querySelector('.title-holder')!.innerText}
    let newTitleForTests = "Some other title";
    fixture.detectChanges();
    expect(getTitle()).toBe('newTab');
    component.tabTitle = newTitleForTests;
    fixture.detectChanges();
    expect(getTitle()).toBe(newTitleForTests)
    // fixture.whenStable().then(() => {expect(getTitle()).toBe(newTitleForTests)})
    
  })

  xit('Should return components uniqueId after element is clicked', async()=>{

    let returnedId = '';
    let setId = function(data: any){

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