import { TestBed } from '@angular/core/testing';

import { ProductCategoriesServices } from './product-categories.services';

describe('ProductCategoriesServices', () => {
  let service: ProductCategoriesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCategoriesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
