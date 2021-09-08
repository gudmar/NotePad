import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveToFileComponent } from './save-to-file.component';

describe('SaveToFileComponent', () => {
  let component: SaveToFileComponent;
  let fixture: ComponentFixture<SaveToFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveToFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveToFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
