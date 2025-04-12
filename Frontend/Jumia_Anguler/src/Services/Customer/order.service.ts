// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { environment } from '../../../Environment/Environment';              //src/environments/environment
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {

//   private baseUrl = environment.apiUrl;

//   constructor(private http: HttpClient) { }

//   getOrdersByCustomerAndStatus(customerId: string, category: string): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}/orders/customer/${customerId}/status/${category}`);
//   }
  

// }







// src/app/order/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../Environment/Environment.prod';
import { OrderDetailsDto, OrderListDto } from '../../Models/order.model';



@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrderDetails(id: number): Observable<OrderDetailsDto> {
    return this.http.get<OrderDetailsDto>(`${this.baseUrl}/Orders/${id}`);
  }

  getOrdersByStatusCategory(customerId: string, category: string): Observable<OrderListDto[]> {
    return this.http.get<OrderListDto[]>(`${this.baseUrl}/Orders/customer/${customerId}/status/${category}`);
  }
  
  // order.service.ts

// cancelOrder(orderId: number): Observable<{ message: string }> {
//   return this.http.post<{ message: string }>(`${this.baseUrl}/Orders/${orderId}/cancel`, {});
// }
 // Cancel Order API call
  cancelOrder(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Orders/${id}/cancel`, {});
  }
}



