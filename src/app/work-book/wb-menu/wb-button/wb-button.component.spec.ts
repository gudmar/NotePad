import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbButtonComponent } from './wb-button.component';

describe('WbButtonComponent', () => {
  let component: WbButtonComponent;
  let fixture: ComponentFixture<WbButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WbButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
