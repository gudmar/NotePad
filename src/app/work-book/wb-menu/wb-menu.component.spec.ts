import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbMenuComponent } from './wb-menu.component';

describe('WbMenuComponent', () => {
  let component: WbMenuComponent;
  let fixture: ComponentFixture<WbMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WbMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
