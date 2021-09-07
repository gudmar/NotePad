import { TestBed } from '@angular/core/testing';

import { GetActiveNoteDataService } from './get-active-note-data.service';

describe('GetActiveNoteDataService', () => {
  let service: GetActiveNoteDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetActiveNoteDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
