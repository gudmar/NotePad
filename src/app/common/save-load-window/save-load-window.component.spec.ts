import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveLoadWindowComponent } from './save-load-window.component';

describe('SaveLoadWindowComponent', () => {
  let component: SaveLoadWindowComponent;
  let fixture: ComponentFixture<SaveLoadWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveLoadWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveLoadWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
