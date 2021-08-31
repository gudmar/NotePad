import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizePointComponent } from './resize-point.component';

describe('ResizePointComponent', () => {
  let component: ResizePointComponent;
  let fixture: ComponentFixture<ResizePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResizePointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
