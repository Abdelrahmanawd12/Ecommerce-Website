import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../Components/interfaces/dashboard-stats';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getRecentOrders(limit: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/recent?limit=${limit}`);
  }
  private apiUrl = 'https://localhost:7266/api/admin';

  constructor(private http: HttpClient) {}
  
  // Orders
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${orderId}`);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${orderId}`);
  }

  // Users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  // Dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  // Products
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}`);
  }

  updateProduct(product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${product.productId}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }
}
