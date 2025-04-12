import { Injectable } from '@angular/core';
import { environment } from '../../Environment/Environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IProduct } from '../../Models/Iproduct';
import { Isubcategory } from '../../Models/Isubcategory';
import { Icategory } from '../../Models/Icategory';
import { IOrder } from '../../Models/iorder';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private baseUrl = environment.apiSellUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.baseUrl}/products`);
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseUrl}/products/${id}`);
  }

  addProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.baseUrl}/addProduct`, product);
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.baseUrl}/updateProduct/${product.productId}`, product);
  }

  deleteProduct(id: number): Observable<IProduct> {
    return this.http.delete<IProduct>(`${this.baseUrl}/delete/${id}`);
  }

  getSubcategoriesByCatName(catName: string): Observable<Isubcategory> {
    return this.http.get<any>(`${this.baseUrl}/subcategories`, { params: { catName } });
  }

  getCategories(): Observable<Icategory> {
    return this.http.get<any>(`${this.baseUrl}/getallCategories`);
  }

  getAllOrders(id: number): Observable<IOrder> {
    return this.http.get<any>(`${this.baseUrl}/orders/${id}`);
  }

  getOrderByDate(id: number, startDate: Date, endDate: Date): Observable<IOrder> {
    const formattedStartDate = formatDate(startDate, 'yyyy-MM-dd', 'en-US');
    const formattedEndDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');

    return this.http.get<IOrder>(`${this.baseUrl}/ordersByDate/${id}`, {
      params: {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      }
    });
  }

  getOrderByStatus(id: number, status: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.baseUrl}/ordersByStatus/${id}`, { params: { status } });
  }

  getOrderByDate2(id: number, date: Date): Observable<IOrder> {
    const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');

    return this.http.get<IOrder>(`${this.baseUrl}/ordersByDate`, {
      params: {
        id: id.toString(),
        date: formattedDate
      }
    });
  }


  UpdateOrderStatus(sellerId: number, orderId: number, status: string): Observable<IOrder> {
    return this.http.patch<IOrder>(`${this.baseUrl}/updateStatus`, { status, orderId, sellerId });
  }

  deleteOrder(orderId: number, sellerId: string): Observable<IOrder> {
    return this.http.delete<IOrder>(`${this.baseUrl}/deleteOrder`, {
       params: {
         orderId, 
         sellerId
         } 
        });
  }
}

