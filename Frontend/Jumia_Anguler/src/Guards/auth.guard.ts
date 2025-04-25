import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GuardService } from './GuardServices/guard.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(GuardService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }};
