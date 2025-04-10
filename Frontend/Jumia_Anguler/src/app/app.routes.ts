import { ShopComponent } from '../Components/Cstomer/shop/shop.component';
import { HomeComponent } from '../Components/home/home.component';
import { CartComponent } from '../Components/cart/cart.component';
import { ProductDetailsComponent } from '../Components/product-details/product-details.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

    { path: 'shop', component: ShopComponent },
    { path: 'shop/:id', component: ShopComponent },
    { path: 'details/:id', component: ProductDetailsComponent },

    { path: 'cart', component: CartComponent },





    {path : '', redirectTo: 'sellerRegisteration', pathMatch: 'full'},
    {path: 'sellerRegisteration', loadComponent: () => import('../Components/seller-register/seller-register.component').then((m) => m.SellerRegisterComponent)},
    {path: 'sellOnJumia', loadComponent: () => import('../Components/SellOnJumia/sell-on-jumia/sell-on-jumia.component').then((m) => m.SellOnJumiaComponent)},
    {path: 'sellerDashboard', loadComponent: () => import('../Components/seller-dashboard/seller-dashboard.component').then((m) => m.SellerDashboardComponent)},
];
