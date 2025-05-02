import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../Services/Customer/cart.service';
import { GuardService } from './GuardServices/guard.service';
import { map } from 'rxjs';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cartService = inject(CartService);
  const authService = inject(GuardService);

  const userId = authService.getUserId();

  if (!userId) {
    router.navigate(['/login']);
    return false;
  }

  return cartService.getCart(userId).pipe(
    map(cart => {
      if (cart?.items?.length > 0) {
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    })
  );
};

