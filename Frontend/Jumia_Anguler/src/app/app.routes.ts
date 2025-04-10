import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' }, 

    { path: 'login', loadComponent: () => import('../Components/login/login.component').then((m) => m.LoginComponent)},
    { path: 'register', loadComponent: () => import('../Components/customer-register/customer-register.component').then(m => m.CustomerRegisterComponent) },
    { path: 'sellerRegisteration', loadComponent: () => import('../Components/seller-register/seller-register.component').then((m) => m.SellerRegisterComponent)},
    { path: 'sellOnJumia', loadComponent: () => import('../Components/SellOnJumia/sell-on-jumia/sell-on-jumia.component').then((m) => m.SellOnJumiaComponent)},
    { path: 'sellerDashboard', loadComponent: () => import('../Components/seller-dashboard/seller-dashboard.component').then((m) => m.SellerDashboardComponent)},

    //error routes
    { path: '**', loadComponent: () => import('../Components/error/error.component').then(m => m.ErrorComponent) },
];
