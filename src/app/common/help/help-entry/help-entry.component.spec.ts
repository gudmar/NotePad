import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEntryComponent } from './help-entry.component';

describe('HelpEntryComponent', () => {
  let component: HelpEntryComponent;
  let fixture: ComponentFixture<HelpEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
