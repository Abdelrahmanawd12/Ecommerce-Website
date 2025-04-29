import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noSellerORAdminGuard } from './no-seller-oradmin.guard';

describe('noSellerORAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noSellerORAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
