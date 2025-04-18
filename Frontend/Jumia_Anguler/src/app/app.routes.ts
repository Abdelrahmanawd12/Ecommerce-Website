import { ShopComponent } from '../Components/Cstomer/shop/shop.component';
import { HomeComponent } from '../Components/home/home.component';
import { CartComponent } from '../Components/cart/cart.component';
import { ProductDetailsComponent } from '../Components/product-details/product-details.component';
import { OrderComponent } from '../Components/order/order.component'; // Adjust this path as needed     ./components/order/order.component
import { Routes } from '@angular/router';
import { AccountComponent } from '../Components/account/account.component';
import { WishlistComponent } from '../Components/wishlist/wishlist.component';
import { AdminLayoutComponent } from '../Components/admin-layout/admin-layout.component';
import { CheckoutComponent } from '../Components/checkout/checkout.component';


export const routes: Routes = [
 
{path:'navbar', loadComponent: () => import('../Components/navbar/navbar.component').then((m) => m.NavbarComponent)},
  {path:'footer' , loadComponent: () => import('../Components/footer/footer.component').then((m) => m.FooterComponent)},

  //Abdelrahman
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopComponent },

  { path: 'cart', component: CartComponent },

    //Ahmed
    //{ path: 'order/:id', component: OrderComponent  },
    { path: 'order', component: OrderComponent  },
    { path: 'account', component: AccountComponent  },
    { path: 'wishlist', component: WishlistComponent  },
    { path: 'checkout', component: CheckoutComponent  },




  { path: 'shop/:id', component: ShopComponent },
  { path: 'details/:id', component: ProductDetailsComponent },





  { path: 'order/:id', component: OrderComponent },

  //Alaa

  //Rania
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
        path: 'prductSales',
        loadComponent: () =>
          import('../Components/Seller_Dashboard_components/seller-sales/seller-sales.component')
            .then((m) => m.SellerSalesComponent)
      },
      {
        path:'reports',
        loadComponent:()=>
          import('../Components/Seller_Dashboard_components/seller-reports/seller-reports.component')
        .then((m)=>m.SellerReportsComponent)
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


  //Yasmine
  { path: 'login', loadComponent: () => import('../Components/login/login.component').then((m) => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('../Components/customer-register/customer-register.component').then(m => m.CustomerRegisterComponent) },

  //error routes
  { path: '', loadComponent: () => import('../Components/error/error.component').then(m => m.ErrorComponent) },
];
