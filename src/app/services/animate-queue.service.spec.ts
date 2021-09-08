import { TestBed } from '@angular/core/testing';

import { AnimateQueueService } from './animate-queue.service';

describe('AnimateQueueService', () => {
  let service: AnimateQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimateQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
