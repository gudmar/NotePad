import { TestBed } from '@angular/core/testing';

import { UniqueIdProviderService } from './unique-id-provider.service';

describe('UniqueIdProviderService', () => {
  let service: UniqueIdProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniqueIdProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
