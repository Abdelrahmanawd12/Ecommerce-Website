import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { CommonModule } from '@angular/common';
import { DashboardStats, Order } from '../interfaces/dashboard-stats';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
   
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentOrders: Order[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  currentDate = new Date();

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    // Load dashboard stats
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loadRecentOrders();
      },
      error: (err) => {
        this.handleError('Failed to load dashboard statistics', err);
      }
    });
  }

  loadRecentOrders(limit: number = 5): void {
    // Reset loading state
    this.isLoading = true;
    this.recentOrders = []; // Clear previous orders while loading
  
    // Show loading for at least 500ms to prevent flickering
    const minLoadingTime = 500;
    const startTime = Date.now();
  
    this.adminService.getRecentOrders(limit).subscribe({
      next: (orders: Order[]) => {
        // Calculate remaining loading time if needed
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsed);
  
        setTimeout(() => {
          this.recentOrders = orders;
          this.isLoading = false;
        }, remainingTime);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading recent orders:', err);
        
        // Different error messages based on status code
        let errorMessage = 'Failed to load recent orders';
        if (err.status === 404) {
          errorMessage = 'Orders endpoint not found';
        } else if (err.status >= 500) {
          errorMessage = 'Server error occurred';
        }
  
        this.handleError(errorMessage, err);
        this.isLoading = false;
        
        // Fallback empty state
        this.recentOrders = [];
      },
      complete: () => {
        console.log('Recent orders loading completed');
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  private handleError(message: string, error: any): void {
    console.error(error);
    this.error = message;
    this.isLoading = false;
  }


  get totalRevenue(): number {
    if (!this.stats) return 0;
    return (
      this.stats.adminWallet +
      this.stats.commissionEarned +
      this.stats.deliveryChargeEarned
    );
  }
}