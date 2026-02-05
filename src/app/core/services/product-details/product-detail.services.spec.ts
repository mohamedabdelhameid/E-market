import { TestBed } from '@angular/core/testing';

import { ProductDetailServices } from './product-detail.services';

describe('ProductDetailServices', () => {
  let service: ProductDetailServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDetailServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
