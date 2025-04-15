import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-dashboard-sidebar',
  imports: [CommonModule,RouterModule],
  templateUrl: './seller-dashboard-sidebar.component.html',
  styleUrls: ['./seller-dashboard-sidebar.component.css']
})
export class SellerDashboardSidebarComponent implements OnInit {
  isManageProductsOpen = false; 
  isProfileMenuOpen = false; 
  activeLink: string = 'home'; 
  constructor() {}
  @Input() isCollapsed: boolean = false;
  @Output() toggle = new EventEmitter<void>();
  
  
  ngOnInit(): void {
    const savedState = localStorage.getItem('sidebarCollapsed');
    this.isCollapsed = savedState === 'true';

    if (this.isCollapsed) {
      this.isManageProductsOpen = false;
      this.isProfileMenuOpen = false;
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebarCollapsed', this.isCollapsed.toString());

    if (this.isCollapsed) {
      this.isManageProductsOpen = false;
      this.isProfileMenuOpen = false;
    }
  }

  toggleManageProductsMenu(): void {
    if (this.isCollapsed) {
      this.isCollapsed = false; 
      setTimeout(() => {
        this.isManageProductsOpen = true; 
      }, 300); 
    } else {
      this.isManageProductsOpen = !this.isManageProductsOpen;
    }
  }
  
  toggleProfileMenu(): void {
    if (this.isCollapsed) {
      this.isCollapsed = false; 
      setTimeout(() => {
        this.isProfileMenuOpen = true; 
      }, 300); 
    } else {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    }
  }
  setActive(linkName: string) {
    this.activeLink = linkName;
  }

  isActive(linkName: string): boolean {
    return this.activeLink === linkName;
  }

  isSubmenuActive(parentLink: 'manage-products' | 'profile'): boolean {
    const submenuLinks: { 'manage-products': string[]; 'profile': string[] } = {
      'manage-products': ['add-product', 'view-products'],
      'profile': ['profile-settings', 'logout']
    };
    return submenuLinks[parentLink]?.includes(this.activeLink) || false;
  }
}