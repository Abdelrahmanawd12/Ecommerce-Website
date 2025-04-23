import { ShopComponent } from '../Components/Cstomer/shop/shop.component';
import { ProductDetailsComponent } from '../Components/product-details/product-details.component';
import { Routes } from '@angular/router';
import { CheckoutComponent } from '../Components/checkout/checkout.component';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  //Abdelrahman
  { path: 'home', loadComponent: () => import('../Components/home/home.component').then((m) => m.HomeComponent) },
  { path: 'shop', loadComponent: () => import('../Components/Cstomer/shop/shop.component').then((m) => m.ShopComponent) },
  { path: 'cart', loadComponent: () => import('../Components/cart/cart.component').then((m) => m.CartComponent) },
  { path: 'awadwishlist', loadComponent: () => import('../Components/awad-wish-list/awad-wish-list.component').then((m) => m.AwadWishListComponent) },
  { path: 'shop/:id', component: ShopComponent },
  { path: 'details/:id', component: ProductDetailsComponent },


  //Ahmed
  //{ path: 'order/:id', component: OrderComponent  },
  // { path: 'order', component: OrderComponent },
  // { path: 'wishlist', component: WishlistComponent },
  { path: 'checkout', component: CheckoutComponent },
  // { path: 'order/:id', component: OrderComponent },

  //Alaa
  {
    path: 'admin',
    loadComponent: () => import('../Components/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
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

  //Rania & Yasmine
  { path: 'sellerRegisteration', loadComponent: () => import('../Components/seller-register/seller-register.component').then((m) => m.SellerRegisterComponent) },
  { path: 'sellOnJumia', loadComponent: () => import('../Components/SellOnJumia/sell-on-jumia/sell-on-jumia.component').then((m) => m.SellOnJumiaComponent) },
  { path: 'intro', loadComponent: () => import('../Components/intro-seller-register/intro-seller-register.component').then((m) => m.IntroSellerRegisterComponent) },
  {
    path: 'sellerDashboard',
    loadComponent: () =>
      import('../Components/Seller_Dashboard_components/seller-dashboard/seller-dashboard.component')
        .then((m) => m.SellerDashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'homeseller',
        pathMatch: 'full'
      },
      {
        path: 'homeseller',
        loadComponent: () =>
          import('../Components/Seller_Dashboard_components/home-dashboard/home-dashboard.component')
            .then((m) => m.HomeDashboardComponent)
      },
      {
        path: 'orderMangement',
        loadComponent: () =>
          import('../Components/Seller_Dashboard_components/order-dashboard/order-dashboard.component')
            .then((m) => m.OrderDashboardComponent)
      },
      {
        path: 'manageProduct',
        loadComponent: () =>
          import('../Components/Seller_Dashboard_components/manage-product/manage-product.component')
            .then((m) => m.ManageProductComponent)
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('../Components/Seller_Dashboard_components/seller-sales/seller-sales.component')
            .then((m) => m.SellerSalesComponent)
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('../Components/Seller_Dashboard_components/seller-reports/seller-reports.component')
            .then((m) => m.SellerReportsComponent)
      },
      {
        path: 'accountprofile',
        loadComponent: () =>
          import('../Components/Seller_Dashboard_components/seller-accountprofile/seller-accountprofile.component')
            .then((m) => m.SellerAccountprofileComponent)
      },
      {
        path: 'addproduct',
        loadComponent: () =>
          import('../Components/Seller_Dashboard_components/add-product-dashboard/add-product-dashboard.component')
            .then((m) => m.AddProductDashboardComponent)
      }
    ]
  },
  {
    path: 'account',
    loadComponent: () =>
      import('../Components/Account_Component/account/account.component')
        .then((m) => m.AccountComponent),    
    children: [
      {
        path: '',
        redirectTo: 'personalInformation',
        pathMatch: 'full'
      },
      {
        path: 'personalInformation',
        loadComponent: () => 
          import('../Components/Account_Component/account-personal-information/account-personal-information.component')
             .then((m) => m.AccountPersonalInformationComponent)
      },
      {
        path: 'order',
        loadComponent: () => 
          import('../Components/Account_Component/order/order.component')
             .then((m) => m.OrderComponent)
      },
      {
        path: 'order/:id',
        loadComponent: () => 
          import('../Components/Account_Component/order/order.component')
             .then((m) => m.OrderComponent)
      },
      {
        path: 'wishlist',
        loadComponent: () => 
          import('../Components/Account_Component/wishlist/wishlist.component')
             .then((m) => m.WishlistComponent)
      }
    ]
    },
  { path: 'help', loadComponent: () => import('../Components/help-center/help-center.component').then((m) => m.HelpCenterComponent) },
  { path: 'login', loadComponent: () => import('../Components/login/login.component').then((m) => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('../Components/customer-register/customer-register.component').then(m => m.CustomerRegisterComponent) },
  //error routes
  { path: '**', loadComponent: () => import('../Components/error/error.component').then(m => m.ErrorComponent) },
];
