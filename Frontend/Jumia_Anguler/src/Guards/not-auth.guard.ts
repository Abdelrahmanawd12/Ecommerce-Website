import { CanActivateFn, Router } from '@angular/router';
import { GuardService } from './GuardServices/guard.service';
import { inject } from '@angular/core';

export const notAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(GuardService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true; 
  } else {
    router.navigate(['/home']); 
    return false;
  }
};
