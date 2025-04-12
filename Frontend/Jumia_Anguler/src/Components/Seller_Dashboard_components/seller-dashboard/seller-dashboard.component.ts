import { Component } from '@angular/core';
import { SellerDashboardSidebarComponent } from '../seller-dashboard-sidebar/seller-dashboard-sidebar.component';
@Component({
  selector: 'app-seller-dashboard',
  imports: [SellerDashboardSidebarComponent],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent {

constructor() {
  
}
}
