import { CanActivateFn, Router } from '@angular/router';
import { GuardService } from './GuardServices/guard.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(GuardService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] || []; 

  const userRole = authService.getUserRole(); 

  if (allowedRoles.includes(userRole)) {
    return true; 
  } else {
    router.navigate(['/login']); 
    return false;
  }
};
