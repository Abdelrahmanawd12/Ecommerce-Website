import { TestBed } from '@angular/core/testing';

import { PaymentService } from './payment-service.service';

describe('PaymentServiceService', () => {
  let service: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
