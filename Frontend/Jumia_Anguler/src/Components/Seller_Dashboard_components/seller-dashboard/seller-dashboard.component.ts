import { Component } from '@angular/core';
import { SellerDashboardSidebarComponent } from '../seller-dashboard-sidebar/seller-dashboard-sidebar.component';
import { ManageProductComponent } from '../manage-product/manage-product.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-seller-dashboard',
  imports: [SellerDashboardSidebarComponent,ManageProductComponent,RouterModule],
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
