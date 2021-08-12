import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabComponent } from './tab.component';

xdescribe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// <div class="tab-wrapper">
//     <div class="tab-shape" [ngClass] = "tabShapeClasses" [style.border-bottom-color] = "bgColor">{{tabTitle}}</div>
// </div>

// @Input() tabTitle: string = "newTab";
// @Input() uniqueId: string = this.idProviderInstance.getUniqueId();
// @Input() bgColor: string = 'white'
// @Input() set isActive(val: boolean) {
//   this.tabShapeClasses.active = val;
//   this._isActive = val;
// };
// @Output() tabChosen = new EventEmitter<string>();
