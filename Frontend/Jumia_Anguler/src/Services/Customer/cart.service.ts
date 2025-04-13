import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { AddToCartDTO, CartDTO, CartSummaryDTO } from '../../Models/cart';
import { environment } from '../../Environment/Environment.prod';
import { IProduct } from '../../Models/Category';


@Injectable({
  providedIn: 'root'
})
export class CartService {

   user= 'user1';

   private cartItemCount = new BehaviorSubject<number>(0);
   public cartItemCount$ = this.cartItemCount.asObservable();

   updateCartCount(count: number) {
     this.cartItemCount.next(count);
   }

  constructor(private http: HttpClient) { }

  addItemToCart(product: IProduct, quantity: number): Observable<any> {
    const dto: AddToCartDTO = {
      customerId: this.user,
      productId: product.productId,
      quantity: quantity,
    };

    return this.http.post(`${environment.apiUrl}/Cart/AddItem`, dto).pipe(
      tap(() => {
        this.getCart(this.user).subscribe(cart => {
          this.updateCartCount(cart.items.length);
        });
      })
    );
  }


  getCart(customerId: string): Observable<CartDTO> {
    return this.http.get<CartDTO>(`${environment.apiUrl}/Cart/${customerId}`);
  }

  getSummary(customerId: string): Observable<CartSummaryDTO> {
    return this.http.get<CartSummaryDTO>(`${environment.apiUrl}/Cart/summary/${customerId}`);
  }

  updateItem(customerId: string, productId: number, quantityChange: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Cart/update/${customerId}/${productId}`, quantityChange);
  }

  removeItemFromBackend(customerId: string, productId: number) {
    return this.http.delete(`${environment.apiUrl}/Cart/remove/${customerId}/${productId}`);
  }

  calculateTotal(products: IProduct[]): number {
    return products.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }


  clearCart(customerId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Cart/clear/${customerId}`);
  }
}
