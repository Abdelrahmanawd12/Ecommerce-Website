import { TestBed } from '@angular/core/testing';

import { SalesReportsService } from './sales-reports.service';

describe('SalesReportsService', () => {
  let service: SalesReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
