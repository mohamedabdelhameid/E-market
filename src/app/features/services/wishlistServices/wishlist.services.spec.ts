import { TestBed } from '@angular/core/testing';

import { WishlistServices } from './wishlist.services';

describe('WishlistServices', () => {
  let service: WishlistServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WishlistServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
