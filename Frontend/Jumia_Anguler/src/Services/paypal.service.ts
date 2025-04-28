
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private apiUrl = 'https://localhost:7266'

  constructor(private http: HttpClient) { }

  createOrder(amount: number, successUrl: string, cancelUrl: string) {
    return this.http.post(`${this.apiUrl}/paypal-create-order`, {
      amount,
      successUrl,
      cancelUrl
    });
  }

  captureOrder(orderId: string) {
    return this.http.post(`${this.apiUrl}/paypal-capture-order`, { orderId });
  }

  checkout(checkoutData: any) {
    return this.http.post(`${this.apiUrl}/checkout-paypal`, checkoutData);
  }
}