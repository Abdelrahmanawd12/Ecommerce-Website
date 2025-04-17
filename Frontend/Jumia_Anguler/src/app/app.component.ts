import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../Components/navbar/navbar.component';
import { FooterComponent } from '../Components/footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent,FooterComponent , HttpClientModule, CommonModule ,FormsModule ],
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

        if (currentRoute === '/login' || currentRoute === '/error' || currentRoute === '/register' || currentRoute === '/sellerRegisteration' || currentRoute === '/sellerDashboard' || currentRoute === '/intro' || currentRoute === '/sellonjumia' || currentRoute === '/dashboard' || currentRoute == '/sellerDashboard/homeseller' || currentRoute == '/sellerDashboard/orderMangement' || currentRoute == '/sellerDashboard/manageProduct' || currentRoute == '/sellerDashboard/prductSales' ||currentRoute == '/sellerDashboard/accountprofile') {
          this.showHeader = false;
        } else {
          this.showHeader = true;
        }

        // Optionally, you can also hide the footer for certain pages
        if (currentRoute === '/login' || currentRoute === '/error' || currentRoute === '/register' || currentRoute === '/sellerRegisteration' || currentRoute === '/sellerDashboard' || currentRoute === '/intro' || currentRoute === '/sellonjumia' || currentRoute === '/dashboard' ||currentRoute == '/sellerDashboard/homeseller' || currentRoute == '/sellerDashboard/orderMangement' || currentRoute == '/sellerDashboard/manageProduct' || currentRoute == '/sellerDashboard/prductSales' ||currentRoute == '/sellerDashboard/accountprofile') {
          this.showFooter = false;
        } else {
          this.showFooter = true;
        }
      }
    });
  }
}