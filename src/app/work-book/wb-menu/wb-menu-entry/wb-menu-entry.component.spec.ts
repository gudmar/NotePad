import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbMenuEntryComponent } from './wb-menu-entry.component';

describe('WbMenuEntryComponent', () => {
  let component: WbMenuEntryComponent;
  let fixture: ComponentFixture<WbMenuEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbMenuEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WbMenuEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
