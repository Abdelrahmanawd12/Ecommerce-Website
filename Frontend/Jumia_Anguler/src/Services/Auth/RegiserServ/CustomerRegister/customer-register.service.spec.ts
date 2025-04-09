import { TestBed } from '@angular/core/testing';

import { CustomerRegisterService } from './customer-register.service';

describe('CustomerRegisterService', () => {
  let service: CustomerRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
