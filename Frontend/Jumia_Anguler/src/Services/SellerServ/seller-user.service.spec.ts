import { TestBed } from '@angular/core/testing';

import { SellerUserService } from './seller-user.service';

describe('SellerUserService', () => {
  let service: SellerUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
