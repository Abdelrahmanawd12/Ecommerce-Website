import { Routes } from '@angular/router';

export const routes: Routes = [
    {path : '', redirectTo: 'sellerRegisteration', pathMatch: 'full'},
    {path: 'sellerRegisteration', loadComponent: () => import('../Components/seller-register/seller-register.component').then((m) => m.SellerRegisterComponent)},
    {path: 'sellOnJumia', loadComponent: () => import('../Components/SellOnJumia/sell-on-jumia/sell-on-jumia.component').then((m) => m.SellOnJumiaComponent)},
    {path: 'sellerDashboard', loadComponent: () => import('../Components/seller-dashboard/seller-dashboard.component').then((m) => m.SellerDashboardComponent)},
];
