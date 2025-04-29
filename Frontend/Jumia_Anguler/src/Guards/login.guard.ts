import { CanActivateFn, Router } from '@angular/router';
import { GuardService } from './GuardServices/guard.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(GuardService);
  const router = inject(Router);
  console.log("Login guard check - isLoggedIn:", authService.isLoggedIn());

  if (authService.isLoggedIn()) {
    const role = authService.getUserRole();
    if(role === 'admin') {
      router.navigate(['/admin']);
      return false;
    } else if(role === 'customer') {
      router.navigate(['/home']);
      return false;
    } else if(role === 'seller') {  
      router.navigate(['/sellerDashboard/homeseller']); 
      return false;
    }
  }
  return true;
};


