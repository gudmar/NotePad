import { TestBed } from '@angular/core/testing';

import { NextColorGeneratorService } from './next-color-generator.service';

describe('NextColorGeneratorService', () => {
  let service: NextColorGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NextColorGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
