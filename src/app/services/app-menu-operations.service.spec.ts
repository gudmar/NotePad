import { TestBed } from '@angular/core/testing';

import { AppMenuOperationsService } from './app-menu-operations.service';

describe('AppMenuOperationsService', () => {
  let service: AppMenuOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppMenuOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
