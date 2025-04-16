


// src/app/order/order.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../Environment/Environment.prod';
// import { OrderDetailsDto, OrderListDto } from '../../Models/order.model';



// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {
//   private baseUrl = environment.apiUrl;

//   constructor(private http: HttpClient) {}

//   getOrderDetails(id: number): Observable<OrderDetailsDto> {
//     return this.http.get<OrderDetailsDto>(`${this.baseUrl}/Orders/${id}`);
//   }

//   getOrdersByStatusCategory(customerId: string, category: string): Observable<OrderListDto[]> {
//     return this.http.get<OrderListDto[]>(`${this.baseUrl}/Orders/customer/${customerId}/status/${category}`);
//   }
  
//  // Cancel Order API call
//   cancelOrder(id: number): Observable<any> {
//     return this.http.post<any>(`${this.baseUrl}/Orders/${id}/cancel`, {});
//   }
// }



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

  cancelOrder(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Orders/${id}/cancel`, {});
  }
}
