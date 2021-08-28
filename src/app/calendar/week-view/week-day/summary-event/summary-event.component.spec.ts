import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryEventComponent } from './summary-event.component';

describe('SummaryEventComponent', () => {
  let component: SummaryEventComponent;
  let fixture: ComponentFixture<SummaryEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
