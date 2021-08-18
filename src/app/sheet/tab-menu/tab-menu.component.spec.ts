import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import { EventEmitter, Output, Component, HostListener } from '@angular/core'
import { TabMenuComponent } from './tab-menu.component';


describe('TabMenuComponent', () => {
  let component: TabMenuComponent;
  let fixture: ComponentFixture<TabMenuComponent>;

  let pages_5 = [
    {'1': {bgColor: 'yellow', title: 'tab nr 1', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper, augue sit amet te'}},
    {'2': {bgColor: 'brown', title: 'tab nr 2', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper, augue sit amet te'}},
    {'3': {bgColor: 'rgb(44, 44, 23)', title: 'tab nr 3', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper, augue sit amet te'}},
    {'4': {bgColor: 'hsl(50, 50%, 60%)', title: 'tab nr 4', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper, augue sit amet te'}},
    {'5': {bgColor: 'orange', title: 'tab nr 6', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper, augue sit amet te'}},
  ]
  let countPageElements = function(tabNativeElement: HTMLElement){
    let elements = tabNativeElement.querySelectorAll('.tab-shape')

    return elements.length;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should create 5 tabs, after pages with 5 positions is send. Because of add button, 6 elements alltogether', () => {
    component.pages = pages_5;
    fixture.detectChanges();
    let elements = fixture.nativeElement.querySelectorAll('tab')
    expect(elements.length).toBe(6)
  });

  it('Tab should emit event with its ID when clicked', ()=>{
    
    component.pages = pages_5;
    fixture.detectChanges();    
    let id = 0;
    let listOfTabs = fixture.nativeElement.querySelectorAll('tab');
    listOfTabs[3].dispatchEvent(new CustomEvent('tabChosen', {detail:4}))
    listOfTabs[3].click();
    fixture.detectChanges();
    expect(component.currentId).toEqual(jasmine.objectContaining({detail:4}))
    expect(component.currentId).not.toBe('')
    
  })
});
