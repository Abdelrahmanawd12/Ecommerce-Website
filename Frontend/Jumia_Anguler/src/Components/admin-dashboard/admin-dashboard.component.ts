import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminDashboard } from '../interfaces/dashboard-stats';


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
  stats!: AdminDashboard;
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.adminService.getDashboardStats().subscribe(data => {
      this.stats = data;
    });

  }
  
}