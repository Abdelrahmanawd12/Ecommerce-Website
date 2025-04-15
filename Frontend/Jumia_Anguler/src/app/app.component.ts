import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '../Components/header/header.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, HttpClientModule, CommonModule],
  providers: [],
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide header for Seller Dashboard, Admin Dashboard, and Login pages
        const currentRoute = this.router.url;

        if (currentRoute === '/login' || currentRoute === '/error' || currentRoute === '/register' || currentRoute === '/sellerRegisteration' || currentRoute === '/sellerDashboard' || currentRoute === '/intro' || currentRoute === '/sellonjumia' || currentRoute === '/dashboard' || currentRoute == '/sellerDashboard/homeseller' || currentRoute == '/sellerDashboard/orderMangement' || currentRoute == '/sellerDashboard/manageProduct' || currentRoute == '/sellerDashboard/prductSales' ||currentRoute == '/sellerDashboard/accountprofile'||currentRoute == '/sellerDashboard/reports') {
          this.showHeader = false;
        } else {
          this.showHeader = true;
        }

        // Optionally, you can also hide the footer for certain pages
        if (currentRoute === '/login' || currentRoute === '/error' || currentRoute === '/register' || currentRoute === '/sellerRegisteration' || currentRoute === '/sellerDashboard' || currentRoute === '/intro' || currentRoute === '/sellonjumia' || currentRoute === '/dashboard' ||currentRoute == '/sellerDashboard/homeseller' || currentRoute == '/sellerDashboard/orderMangement' || currentRoute == '/sellerDashboard/manageProduct' || currentRoute == '/sellerDashboard/prductSales' ||currentRoute == '/sellerDashboard/accountprofile'||currentRoute == '/sellerDashboard/reports') {
          this.showFooter = false;
        } else {
          this.showFooter = true;
        }
      }
    });
  }
}