import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';

import { NoteComponent } from './note.component';
import { CommunicationService } from '../services/communication.service';

describe('NoteComponent', () => {
  let component: NoteComponent;
  let fixture: ComponentFixture<NoteComponent>;
  let communicationService;

  beforeEach(async () => {
    communicationService = jasmine.createSpyObj(['inform'])
    await TestBed.configureTestingModule({
      declarations: [ NoteComponent ],
      providers: [ {provide: CommunicationService, useValue: communicationService}]
    })
    .compileComponents();
  });

  // inform(eventType: string, data: any)

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should add a dashed border, after component is clicked', () => {
    let testedComponent = fixture
  })
});
