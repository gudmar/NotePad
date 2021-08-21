import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KillMeComponent } from './kill-me.component';

describe('KillMeComponent', () => {
  let component: KillMeComponent;
  let fixture: ComponentFixture<KillMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KillMeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KillMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
