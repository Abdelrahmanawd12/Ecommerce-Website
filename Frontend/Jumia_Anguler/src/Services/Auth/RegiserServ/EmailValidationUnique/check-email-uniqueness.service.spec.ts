import { TestBed } from '@angular/core/testing';

import { CheckEmailUniquenessService } from './check-email-uniqueness.service';

describe('CheckEmailUniquenessService', () => {
  let service: CheckEmailUniquenessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckEmailUniquenessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
