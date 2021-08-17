import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkBookComponent } from './work-book.component';

describe('WorkBookComponent', () => {
  let component: WorkBookComponent;
  let fixture: ComponentFixture<WorkBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
