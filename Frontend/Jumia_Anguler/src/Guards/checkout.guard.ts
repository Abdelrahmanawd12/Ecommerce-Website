import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../Services/Customer/cart.service';
import { GuardService } from './GuardServices/guard.service';
import { map } from 'rxjs';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cartService = inject(CartService); 
  const authService = inject(GuardService);

  return cartService.getCart(authService.getUserId()).pipe(
    map(cart => {
      console.log('Cart data received:', cart);
      if (cart && cart.items && cart.items.length > 0) {
        return true;
      } else {
        router.navigate(['/cart']); 
        return false;
      }
    })
  );
};
