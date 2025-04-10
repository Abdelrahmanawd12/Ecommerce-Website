import { Routes } from '@angular/router';
import { ShopComponent } from '../Components/Cstomer/shop/shop.component';
import { HomeComponent } from '../Components/home/home.component';
import { CartComponent } from '../Components/cart/cart.component';
import { ProductDetailsComponent } from '../Components/product-details/product-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

    { path: 'shop', component: ShopComponent },
    { path: 'shop/:id', component: ShopComponent },
    { path: 'details/:id', component: ProductDetailsComponent },

    { path: 'cart', component: CartComponent },





];
