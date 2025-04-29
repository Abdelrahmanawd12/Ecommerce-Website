import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminDashboard } from '../Components/interfaces/dashboard-stats';



@Injectable({
  providedIn: 'root'
})
export class AdminService {
 
  private baseUrl  = 'https://localhost:7266/api/admin';

  constructor(private http: HttpClient) {}
 

  getDashboardStats(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.baseUrl}/dashboard-stats`);
  }
}
