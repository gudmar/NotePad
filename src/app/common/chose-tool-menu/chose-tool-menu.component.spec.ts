import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoseToolMenuComponent } from './chose-tool-menu.component';

describe('ChoseToolMenuComponent', () => {
  let component: ChoseToolMenuComponent;
  let fixture: ComponentFixture<ChoseToolMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoseToolMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoseToolMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
