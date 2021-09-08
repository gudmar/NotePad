import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformUserNotDisturbComponent } from './inform-user-not-disturb.component';

describe('InformUserNotDisturbComponent', () => {
  let component: InformUserNotDisturbComponent;
  let fixture: ComponentFixture<InformUserNotDisturbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformUserNotDisturbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformUserNotDisturbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
