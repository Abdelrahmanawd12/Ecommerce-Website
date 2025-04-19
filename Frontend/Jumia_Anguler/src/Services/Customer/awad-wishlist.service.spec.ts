import { TestBed } from '@angular/core/testing';

import { AwadWishlistService } from './awad-wishlist.service';

describe('AwadWishlistService', () => {
  let service: AwadWishlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwadWishlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
