import { TestBed } from '@angular/core/testing';

import { SellerRegisterService } from './seller-register.service';

describe('SellerRegisterService', () => {
  let service: SellerRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
