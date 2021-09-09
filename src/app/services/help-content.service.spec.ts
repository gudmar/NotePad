import { TestBed } from '@angular/core/testing';

import { HelpContentService } from './help-content.service';

describe('HelpContentService', () => {
  let service: HelpContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelpContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
