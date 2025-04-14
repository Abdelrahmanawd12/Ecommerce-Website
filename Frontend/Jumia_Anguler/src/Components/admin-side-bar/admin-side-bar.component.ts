import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-side-bar.component.html',
  styleUrls: ['./admin-side-bar.component.css']
})
export class AdminSideBarComponent implements OnInit {
  @Output() collapseChange = new EventEmitter<boolean>(); // Emit collapse state
  
  isCollapsed = false;
  isUsersMenuOpen = false;
  isProductsMenuOpen = false;
  activeLink: string = 'dashboard';

  ngOnInit(): void {
    const savedState = localStorage.getItem('adminSidebarCollapsed');
    this.isCollapsed = savedState === 'true';
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('adminSidebarCollapsed', this.isCollapsed.toString());
    this.collapseChange.emit(this.isCollapsed); // Emit the new state
    
    if (this.isCollapsed) {
      this.isUsersMenuOpen = false;
      this.isProductsMenuOpen = false;
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

  toggleProductsMenu() {
    if (this.isCollapsed) {
      this.isCollapsed = false;
      setTimeout(() => {
        this.isProductsMenuOpen = true;
      }, 300);
    } else {
      this.isProductsMenuOpen = !this.isProductsMenuOpen;
    }
  }

  setActive(link: string) {
    this.activeLink = link;
  }

  isActive(link: string): boolean {
    return this.activeLink === link;
  }

  isSubmenuActive(parentLink: 'users' | 'products'): boolean {
    const map = {
      users: ['add-user', 'view-users'],
      products: ['add-product', 'view-products']
    };
    return map[parentLink].includes(this.activeLink);
  }
}
