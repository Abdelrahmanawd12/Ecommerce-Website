import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-side-bar.component.html',
  styleUrls: ['./admin-side-bar.component.css']
})
export class AdminSideBarComponent implements OnInit {

  @Output() collapseChange = new EventEmitter<boolean>();
 
  isCollapsed = false;
  isUsersMenuOpen = false;
  isCategoriesMenuOpen = false;
  isSubcategoriesMenuOpen = false;
  isProfileMenuOpen = false;
  isLogoutConfirmationOpen = false;
  showLogoutModal = false;
  activeLink: string = 'home';
  toastr: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['/admin/dashboard']);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;

     
      if (url.includes('home')) {
        this.activeLink = 'home'; 
      } else if (url.includes('adduser')) {
        this.activeLink = 'add-user';
      } else if (url.includes('users')) {
        this.activeLink = 'view-users';
      } else if (url.includes('categories')) {
        this.activeLink = 'view-categories';
      } else if (url.includes('subcategories')) {
        this.activeLink = 'view-subcategories';
      } else if (url.includes('accountprofile')) {
        this.activeLink = 'account-settings';
      } else if (url.includes('reports')) {
        this.activeLink = 'reports';
      } else {
        this.activeLink = '';
      }
    });
  }
 
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('adminSidebarCollapsed', this.isCollapsed.toString());
    this.collapseChange.emit(this.isCollapsed);

    if (this.isCollapsed) {
     
      this.isUsersMenuOpen = false;
      this.isCategoriesMenuOpen = false;
      this.isSubcategoriesMenuOpen = false;
      this.isProfileMenuOpen = false;
    }
  }
 
 
  toggleCategoriesMenu() {
    if (this.isCollapsed) {
      this.isCollapsed = false;
      setTimeout(() => {
        this.isCategoriesMenuOpen = true;
      }, 300);
    } else {
      this.isCategoriesMenuOpen = !this.isCategoriesMenuOpen;
    }
  }

  toggleSubcategoriesMenu() {
    if (this.isCollapsed) {
      this.isCollapsed = false;
      setTimeout(() => {
        this.isSubcategoriesMenuOpen = true;
      }, 300);
    } else {
      this.isSubcategoriesMenuOpen = !this.isSubcategoriesMenuOpen;
    }
  }

  toggleUsersMenu() {
    if (this.isCollapsed) {
      this.isCollapsed = false;
      setTimeout(() => {
        this.isUsersMenuOpen = true;
      }, 300);
    } else {
      this.isUsersMenuOpen = !this.isUsersMenuOpen;
    }
  }

  toggleProfileMenu() {
    if (this.isCollapsed) {
      this.isCollapsed = false;
      setTimeout(() => {
        this.isProfileMenuOpen = true;
      }, 300);
    } else {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    }
  }

  isActive(link: string): boolean {
    return this.activeLink === link;
  }

  isSubmenuActive(parentLink: 'users' | 'categories' | 'subcategories' | 'profile'): boolean {
    const map = {
      users: ['add-user', 'view-users'],
      categories: ['view-categories', 'add-category'],
      subcategories: ['view-subcategories', 'add-subcategory'],
      profile: ['account-settings', 'logout']
    };
    return map[parentLink].includes(this.activeLink);
  }

  
  showToast() {
    console.log('Showing logout toast');
    const toastElement = document.getElementById('logoutToast');
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    } else {
      console.error('Logout toast element not found');
    }
  }
  openLogoutConfirmation() {
    this.isLogoutConfirmationOpen = true;
  }
  
  closeLogoutConfirmation() {
    this.isLogoutConfirmationOpen = false;
  }
  
  Onlogout() {
    this.isLogoutConfirmationOpen = false;
    this.showToast();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }
  




  openLogoutModal() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  confirmLogout() {
   
    localStorage.clear();
    
  
   
    sessionStorage.clear();
    
    
    this.router.navigate(['/login']);
    
  
    this.closeLogoutModal();
    
 
    this.toastr.success('Logout successful')
    
  }
}