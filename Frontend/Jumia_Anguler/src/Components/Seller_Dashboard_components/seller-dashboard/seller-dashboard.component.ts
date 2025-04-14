import { Component } from '@angular/core';
import { SellerDashboardSidebarComponent } from '../seller-dashboard-sidebar/seller-dashboard-sidebar.component';
import { HomeDashboardComponent } from "../home-dashboard/home-dashboard.component";
import { RouterModule } from '@angular/router';
import { ManageProductComponent } from '../manage-product/manage-product.component';
@Component({
  selector: 'app-seller-dashboard',
  imports: [SellerDashboardSidebarComponent, HomeDashboardComponent,ManageProductComponent, RouterModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent {
// app.component.ts
isCollapsed = false;

toggleSidebar() {
  this.isCollapsed = !this.isCollapsed;
}

constructor() {
  
}
}
