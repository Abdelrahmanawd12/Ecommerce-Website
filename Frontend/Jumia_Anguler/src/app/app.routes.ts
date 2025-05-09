import { Routes } from '@angular/router';
import { ShopComponent } from '../Components/Cstomer/shop/shop.component';
import { ProductDetailsComponent } from '../Components/product-details/product-details.component';
import { OrderSuccessComponent } from '../Components/order-success/order-success.component';
import { SuccessComponent } from '../Components/success/success.component';
import { CancelComponent } from '../Components/cancel/cancel.component';
import { authGuard } from '../Guards/auth.guard';
import { loginGuard } from '../Guards/login.guard';
import { roleGuard } from '../Guards/role.guard';
import { checkoutGuard } from '../Guards/checkout.guard';
import { noSellerOrAdminGuard } from '../Guards/no-seller-oradmin.guard';
import { UnauthorizedComponent } from '../Components/unauthorized/unauthorized.component';
import { ErrorComponent } from '../Components/error/error.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'home', loadComponent: () => import('../Components/home/home.component').then((m) => m.HomeComponent) ,
   canActivate:[noSellerOrAdminGuard]
  },
  { path: 'shop', loadComponent: () => import('../Components/Cstomer/shop/shop.component').then((m) => m.ShopComponent) },
  { path: 'cart', loadComponent: () => import('../Components/cart/cart.component').then((m) => m.CartComponent) ,
     canActivate: [authGuard,loginGuard,roleGuard],
     data: { roles: ['Customer'] } },
  { path: 'shop/:id', component: ShopComponent },
  { path: 'details/:id', component: ProductDetailsComponent },

  {
    path: 'checkout',
    loadComponent: () => import('../Components/checkout/checkout.component').then((m) => m.CheckoutComponent),
    canActivate: [authGuard]
  },

  {
    path: 'admin',
    loadComponent: () => import('../Components/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('../Components/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent) },
      { path: 'products', loadComponent: () => import('../Components/admin-product/admin-product.component').then((m) => m.AdminProductComponent) },
      { path: 'users', loadComponent: () => import('../Components/admin-users/admin-users.component').then((m) => m.AdminUsersComponent) },
      { path: 'adduser', loadComponent: () => import('../Components/adduser/adduser.component').then((m) => m.AdduserComponent) },
      { path: 'edit-user/:id', loadComponent: () => import('../Components/edituser/edituser.component').then((m) => m.EditUserComponent) },
      { path: 'accountprofile', loadComponent: () => import('../Components/admin-accountprofile/admin-accountprofile.component').then((m) => m.AdminAccountprofileComponent) },
      { path: 'categories', loadComponent: () => import('../Components/admin-category/admin-category.component').then((m) => m.AdminCategoryComponent) },
      { path: 'addcategory', loadComponent: () => import('../Components/add-category/add-category.component').then((m) => m.AddCategoryComponent) },
      { path: 'updatecategory/:id', loadComponent: () => import('../Components/updatecategory/updatecategory.component').then((m) => m.UpdatecategoryComponent) },
      { path: 'reports', loadComponent: () => import('../Components/admin-report/admin-report.component').then((m) => m.AdminReportComponent) },
    ]
  },

  { path: 'sellerRegisteration', loadComponent: () => import('../Components/seller-register/seller-register.component').then((m) => m.SellerRegisterComponent) },
  { path: 'sellOnJumia', loadComponent: () => import('../Components/SellOnJumia/sell-on-jumia/sell-on-jumia.component').then((m) => m.SellOnJumiaComponent) },
  { path: 'intro', loadComponent: () => import('../Components/intro-seller-register/intro-seller-register.component').then((m) => m.IntroSellerRegisterComponent) },
  { path: 'shipping', loadComponent: () => import('../Components/shipping-delivery/shipping-delivery.component').then((m) => m.ShippingDeliveryComponent) },
  { path: 'sellingExpenses' , loadComponent: () => import('../Components/selling-expenses/selling-expenses.component').then((m) => m.SellingExpensesComponent) },
  {
    path: 'sellerDashboard',
    loadComponent: () => import('../Components/Seller_Dashboard_components/seller-dashboard/seller-dashboard.component').then((m) => m.SellerDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Seller'] },
    children: [
      { path: '', redirectTo: 'homeseller', pathMatch: 'full' },
      { path: 'homeseller', loadComponent: () => import('../Components/Seller_Dashboard_components/home-dashboard/home-dashboard.component').then((m) => m.HomeDashboardComponent) },
      { path: 'orderMangement', loadComponent: () => import('../Components/Seller_Dashboard_components/order-dashboard/order-dashboard.component').then((m) => m.OrderDashboardComponent) },
      { path: 'manageProduct', loadComponent: () => import('../Components/Seller_Dashboard_components/manage-product/manage-product.component').then((m) => m.ManageProductComponent) },
      { path: 'sales', loadComponent: () => import('../Components/Seller_Dashboard_components/seller-sales/seller-sales.component').then((m) => m.SellerSalesComponent) },
      { path: 'reports', loadComponent: () => import('../Components/Seller_Dashboard_components/seller-reports/seller-reports.component').then((m) => m.SellerReportsComponent) },
      { path: 'accountprofile', loadComponent: () => import('../Components/Seller_Dashboard_components/seller-accountprofile/seller-accountprofile.component').then((m) => m.SellerAccountprofileComponent) },
      { path: 'addproduct', loadComponent: () => import('../Components/Seller_Dashboard_components/add-product-dashboard/add-product-dashboard.component').then((m) => m.AddProductDashboardComponent) },
    ]
  },

  { path: 'order-success', component: OrderSuccessComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'cancel', component: CancelComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: 'account',
    loadComponent: () => import('../Components/Account_Component/account/account.component').then((m) => m.AccountComponent),
    canActivate: [authGuard,loginGuard, roleGuard],
    data: { roles: ['Customer'] },
    children: [
      { path: '', redirectTo: 'personalInformation', pathMatch: 'full' },
      { path: 'personalInformation', loadComponent: () => import('../Components/Account_Component/account-personal-information/account-personal-information.component').then((m) => m.AccountPersonalInformationComponent) },
      { path: 'order', loadComponent: () => import('../Components/Account_Component/order/order.component').then((m) => m.OrderComponent) },
      { path: 'order/:id', loadComponent: () => import('../Components/Account_Component/order/order.component').then((m) => m.OrderComponent) },
      { path: 'wishlist', loadComponent: () => import('../Components/Account_Component/wishlist/wishlist.component').then((m) => m.WishlistComponent) },
      { path: 'awadWishlist', loadComponent: () => import('../Components/awad-wish-list/awad-wish-list.component').then((m) => m.AwadWishListComponent) },
    ]
  },

  {path:'registration-success',loadComponent:()=>import('../Components/Seller_Dashboard_components/registeration-success/registeration-success.component').then((m)=>m.RegisterationSuccessComponent)},
  { path: 'help', loadComponent: () => import('../Components/help-center/help-center.component').then((m) => m.HelpCenterComponent) },
  { path: 'login', loadComponent: () => import('../Components/login/login.component').then((m) => m.LoginComponent), canActivate: [loginGuard] },
  { path: 'register', loadComponent: () => import('../Components/customer-register/customer-register.component').then(m => m.CustomerRegisterComponent), canActivate: [loginGuard] },
  { path: 'forgotpassword', loadComponent: () => import('../Components/Password/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent)},
  { path: 'resetpassword', loadComponent: () => import('../Components/Password/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent)},
  // error page
  { path: '**',component:ErrorComponent},
];
