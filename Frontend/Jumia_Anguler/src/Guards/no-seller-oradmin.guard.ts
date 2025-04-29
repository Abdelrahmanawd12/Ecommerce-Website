import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const noSellerOrAdminGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('role');
  const router = inject(Router);

  if (role === 'Seller' || role === 'Admin') {
    router.navigate(['/unauthorized']); 
    return false;
  }

  return true;
};
