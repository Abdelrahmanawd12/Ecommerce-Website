import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LogoutService } from '../../../Services/Auth/logout.service';
declare var bootstrap: any;
import { ViewChild, ElementRef } from '@angular/core';
// Removed conflicting import of bootstrap
@Component({
  selector: 'app-seller-dashboard-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './seller-dashboard-sidebar.component.html',
  styleUrls: ['./seller-dashboard-sidebar.component.css']
})
export class SellerDashboardSidebarComponent implements OnInit {
  isManageProductsOpen = false;
  isProfileMenuOpen = false;
  activeLink: string = 'home';
  constructor(private logout: LogoutService, private router: Router) { }


  @Input() isCollapsed: boolean = false;
  @Output() toggle = new EventEmitter<void>();


  ngOnInit(): void {
    const modalElement = document.getElementById('logoutModal');
    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', () => {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        });
    }
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
  @ViewChild('logoutModal') logoutModal!: ElementRef;

  openLogoutModal() {
      this.setActive('logout');
      const modal = new bootstrap.Modal(this.logoutModal.nativeElement);
      modal.show();
  }
  
  confirmLogout() {
      const modal = bootstrap.Modal.getInstance(this.logoutModal.nativeElement);
      modal?.hide();
      this.logout.logout();
      this.showToast();
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

  // confirmLogout() {
  //   // Hide the modal first
  //   try {
  //     const modal = bootstrap.Modal.getInstance(document.getElementById('logoutModal'));
  //     if (modal) {
  //       modal.hide(); 
  //     }
  //     this.logout.logout();
  //     this.showToast();
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //   }
  //   // Perform logout
  //   this.logout.logout();

  //   // Show toast notification
  //   this.showToast();
  // }

  showToast() {
    // Implement your toast notification logic here
    console.log('Showing logout toast');
    // Example using Bootstrap toast:
    const toast = new bootstrap.Toast(document.getElementById('logoutToast'));
    toast.show();
  }

}