import { TestBed } from '@angular/core/testing';

import { AdminUserService } from './useradmin.service';

describe('UseradminService', () => {
  let service: AdminUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
