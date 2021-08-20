import { TestBed } from '@angular/core/testing';

import { DescriptorToDataService } from './descriptor-to-data.service';

xdescribe('DescriptorToDataService', () => {
  let service: DescriptorToDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescriptorToDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
