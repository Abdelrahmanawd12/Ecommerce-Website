// services/checkout.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../Environment/Environment.prod';
import { IOrder } from '../../Models/iorder';
import { Icheckout } from '../../Models/icheckout';
import { Observable } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService{
  private apiUrl = `${environment.apiSellUrl}`;

  constructor(private http: HttpClient) {}

  checkout(data: Icheckout) {
    return this.http.post(`${this.apiUrl}/checkout`, data);
  }

  getSellerIdByProductId(productId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/cartData?productId=${productId}`, {
      responseType: 'text' as 'json'
    }) as Observable<string>;

  }
}
