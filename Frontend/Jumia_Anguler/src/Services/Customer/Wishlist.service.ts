import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WishlistItem } from '../../Models/Wishlist';
import { environment } from '../../Environment/Environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/Wishlist`; // Make sure to replace this with your API URL

  constructor(private http: HttpClient) {}

  getWishlist(customerId: string): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/${customerId}`);
  }

  deleteWishlistItem(wishlistItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/item/${wishlistItemId}`);
  }

  addToCart(wishlistItemId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-to-cart`, wishlistItemId);
  }
  
}
