import { TestBed } from '@angular/core/testing';

import { ProductServiceServices } from './product-service.services';

describe('ProductServiceServices', () => {
  let service: ProductServiceServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductServiceServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
