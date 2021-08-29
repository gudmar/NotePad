import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveToWindowComponent } from './move-to-window.component';

xdescribe('MoveToWindowComponent', () => {
  let component: MoveToWindowComponent;
  let fixture: ComponentFixture<MoveToWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveToWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveToWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
