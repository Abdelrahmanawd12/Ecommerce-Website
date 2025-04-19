import { CanActivateFn, Router } from '@angular/router';
import { GuardService } from './GuardServices/guard.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(GuardService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    router.navigate(['/dashboard']); 
    return false;
  }

  return true; 
};
