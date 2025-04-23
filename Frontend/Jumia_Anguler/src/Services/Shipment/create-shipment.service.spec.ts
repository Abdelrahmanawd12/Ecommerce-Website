import { TestBed } from '@angular/core/testing';

import { CreateShipmentService } from './create-shipment.service';

describe('CreateShipmentService', () => {
  let service: CreateShipmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateShipmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
