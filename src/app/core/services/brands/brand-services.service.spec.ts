import { TestBed } from '@angular/core/testing';

import { BrandServicesService } from './brand-services.service';

describe('BrandServicesService', () => {
  let service: BrandServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
