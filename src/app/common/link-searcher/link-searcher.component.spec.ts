import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSearcherComponent } from './link-searcher.component';

describe('LinkSearcherComponent', () => {
  let component: LinkSearcherComponent;
  let fixture: ComponentFixture<LinkSearcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkSearcherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
