import { Component } from '@angular/core';
import { SellerDashboardSidebarComponent } from '../seller-dashboard-sidebar/seller-dashboard-sidebar.component';
import { HomeDashboardComponent } from "../home-dashboard/home-dashboard.component";
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-seller-dashboard',
  imports: [SellerDashboardSidebarComponent, HomeDashboardComponent, RouterModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent {

constructor() {
  
}
}
