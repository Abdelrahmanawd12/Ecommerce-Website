import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminSideBarComponent } from '../admin-side-bar/admin-side-bar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule,RouterModule ,AdminSideBarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  isCollapsed: boolean = false;
  collapseChange: any;
  isUsersMenuOpen: boolean | undefined;
  isCategoriesMenuOpen: boolean | undefined;
  isSubcategoriesMenuOpen: boolean | undefined;
  isProfileMenuOpen: boolean | undefined;

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
}
