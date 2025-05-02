import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../Components/navbar/navbar.component';
import { FooterComponent } from '../Components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { ChatBotAiComponent } from "../Components/chat-bot-ai/chat-bot-ai.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, HttpClientModule, CommonModule, NgxEchartsModule, FormsModule, ChatBotAiComponent],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: {
        echarts: () => import('echarts')
      }
    }
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Jumia_Anguler';

  isErrorPage: boolean = false;
  isRegisterPage: boolean = false;
  isLoginPage: boolean = false;
  isSellerRegisterationPage: boolean = false;
  isSellerDashboardPage: boolean = false;
  isIntroPage: boolean = false;
  isSellonJumiaPage: boolean = false;
  isAdminDashboardPage: boolean = false;
  isManageProductPage: boolean = false;

  showHeader: boolean = true; // Flag to control header visibility
  showFooter: boolean = true; // Flag to control footer visibility
  showChatBot = false;
  showMarginTop: boolean = true; // Flag to control margin
  showChatbotAI: boolean = true; //Flag to control ChatbotAI

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;

      const pagesWithChatBot = [
        '/home',
        '/cart',
        '/wishlist','/intro','/order','/account','/shop/:id',
        '/details/:id','/shop','/order/:id'
      ];

      this.showChatBot = pagesWithChatBot.some(path => url.startsWith(path));
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide header for Seller Dashboard, Admin Dashboard, and Login pages
        const currentRoute = this.router.url;

        if (currentRoute === '/login' || currentRoute === '/error' || currentRoute === '/register'
          || currentRoute === '/sellerRegisteration' || currentRoute === '/sellerDashboard' || currentRoute === '/intro'
          || currentRoute === '/sellOnJumia' || currentRoute === '/dashboard' || currentRoute == '/sellerDashboard/homeseller'
          || currentRoute == '/sellerDashboard/orderMangement' || currentRoute == '/sellerDashboard/manageProduct'
          || currentRoute == '/sellerDashboard/prductSales' || currentRoute == '/sellerDashboard/accountprofile'
          || currentRoute == '/sellerDashboard/reports' || currentRoute == '/sellerDashboard/addproduct'
          || currentRoute == '/sellerDashboard/sales' || currentRoute == '/admin' || currentRoute == '/admin/dashboard' || currentRoute == '/admin/products'
          || currentRoute == '/admin/users' ||currentRoute == '/admin/adduser'|| currentRoute == '/admin/edit-user/:id' || currentRoute == '/admin/accountprofile' || currentRoute == '/admin/categories'
          || currentRoute == '/admin/addcategory'|| currentRoute == '/admin/reports'|| currentRoute == '/checkout'
          ||currentRoute=='/order-success'||currentRoute=='/success'||currentRoute=='/cancel' || currentRoute == '/forgotpassword'
          || currentRoute.startsWith('/resetpassword')
          || currentRoute == '/admin/addcategory'|| currentRoute == '/admin/reports'|| currentRoute == '/checkout'||currentRoute=='/order-success'
          ||currentRoute=='/success'||currentRoute=='/cancel'||currentRoute=='/unauthorized'||currentRoute == '/shipping'||currentRoute == '/sellingExpenses'
        ) {
          this.showHeader = false;
          this.showMarginTop = false;
          this.showChatbotAI = false;
        } else {
          this.showHeader = true;
          this.showMarginTop = true;
          this.showChatbotAI = true;
        }

        // Optionally, you can also hide the footer for certain pages
        if (currentRoute === '/login' || currentRoute === '/error' || currentRoute === '/register'
          || currentRoute === '/sellerRegisteration' || currentRoute === '/sellerDashboard' || currentRoute === '/intro'
          || currentRoute === '/sellOnJumia' || currentRoute === '/dashboard' || currentRoute == '/sellerDashboard/homeseller'
          || currentRoute == '/sellerDashboard/orderMangement' || currentRoute == '/sellerDashboard/manageProduct'
          || currentRoute == '/sellerDashboard/prductSales' || currentRoute == '/sellerDashboard/accountprofile'
          || currentRoute == '/sellerDashboard/reports' || currentRoute == '/sellerDashboard/addproduct'
          || currentRoute == '/sellerDashboard/sales' || currentRoute == '/admin' || currentRoute == '/admin/dashboard'
          || currentRoute == '/admin/products'
          || currentRoute == '/admin/users' || currentRoute == '/admin/adduser'|| currentRoute == '/admin/edit-user/:id' || currentRoute == '/admin/accountprofile'
          || currentRoute == '/admin/categories'
          || currentRoute == '/admin/addcategory'|| currentRoute == '/admin/reports'|| currentRoute == '/checkout'
          ||currentRoute=='/order-success'||currentRoute=='/success'||currentRoute=='/cancel'|| currentRoute == '/forgotpassword'
          || currentRoute.startsWith('/resetpassword')
          || currentRoute == '/admin/addcategory'|| currentRoute == '/admin/reports'|| currentRoute == '/checkout'||currentRoute=='/order-success'
          ||currentRoute=='/success'||currentRoute=='/cancel'||currentRoute=='/unauthorized'||currentRoute == '/shipping'||currentRoute == '/sellingExpenses'
        ) {
          this.showFooter = false;
          this.showMarginTop = false;
          this.showChatbotAI = false;
        } else {
          this.showFooter = true;
          this.showMarginTop = true;
          this.showChatbotAI = true;
        }
      }
    });

  }
 

}
