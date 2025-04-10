import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' }, 

    {path: 'register', loadComponent: () => import('../Components/customer-register/customer-register.component').then(m => m.CustomerRegisterComponent) },

    { path: '**', loadComponent: () => import('../Components/error/error.component').then(m => m.ErrorComponent) }
      
];
