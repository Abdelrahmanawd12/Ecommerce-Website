import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../src/Environment/Environment';
import { Address, AddressBook, CartSummary, Checkout } from '../../Models/Checkout';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = `${environment.apiUrl}/Checkout`;;

  constructor(private http: HttpClient) {}

  addAddress(address: Address): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, address);
  }

  getCartProducts(userId: string): Observable<CartSummary> {
    return this.http.get<CartSummary>(`${this.apiUrl}/cart-products/${userId}`);
  }


  // تأكيد الطلب
  confirmOrder(orderPayload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/confirm`, orderPayload);  // هتبعته هنا
  }


  getAddressBook(customerId: string): Observable<AddressBook> {
      return this.http.get<AddressBook>(`${this.apiUrl}/address-book/${customerId}`);
    }

// Method to update the address book
   updateAddressBook(customerId: string, addressBook: AddressBook): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/address-book/${customerId}`, addressBook);
  }
  // getCartSummary(customerId: string): Observable<CartSummary> {
  //   return this.http.get<CartSummary>(`${this.apiUrl}/checkout/summary/${customerId}`);
  // }
  

  // getAddressBook(customerId: string): Observable<AddressBook> {
  //   return this.http.get<AddressBook>(`${this.apiUrl}/account/address-book/${customerId}`);
  // }

  // updateAddressBook(customerId: string, addressBook: AddressBook): Observable<void> {
  //   return this.http.put<void>(`${this.apiUrl}/account/address-book/${customerId}`, addressBook);
  // }

  // getCartProducts(customerId: string): Observable<CartProduct[]> {
  //   return this.http.get<CartProduct[]>(`${this.apiUrl}/account/cart?customerId=${customerId}`);
  // }
  
  
  
  
}

