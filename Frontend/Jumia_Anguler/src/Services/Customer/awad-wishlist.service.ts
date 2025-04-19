import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddToWishlistDTO, AwadWishlistDTO } from '../../Models/AwadWishlist';
import { environment } from '../../Environment/Environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AwadWishlistService {
  get userId(): string {
    return localStorage.getItem('userId') || '';
  }

  constructor(private httpClient:HttpClient) { }
  getWishlist(customerId: string):Observable<AwadWishlistDTO>
  {
    return this.httpClient.get<AwadWishlistDTO>(`${environment.apiUrl}/AwadWishlist/${customerId}`);
  }
  addToWishlist(customerId: string, productId: number):Observable<AddToWishlistDTO>
  {
    const dto: AddToWishlistDTO = {
      customerId: this.userId,
      productId: productId
    };
    return this.httpClient.post<AddToWishlistDTO>(`${environment.apiUrl}/AwadWishlist/AddItem`, dto);
  }
  removeFromWishlist(customerId: string, productId: number):Observable<any>
  {
    return this.httpClient.delete(`${environment.apiUrl}/AwadWishlist/RemoveItem?productId=${productId}&customerId=${this.userId}`);
  }
  clearWishlist(customerId: string):Observable<any>
  {
    return this.httpClient.delete<void>(`${environment.apiUrl}/AwadWishlist/Clear?customerId=${this.userId}`);
  }
}
