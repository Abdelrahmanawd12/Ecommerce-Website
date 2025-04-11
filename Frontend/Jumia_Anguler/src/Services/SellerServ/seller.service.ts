import { Injectable } from '@angular/core';
import { environment } from '../../Environment/Environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IProduct } from '../../Models/Iproduct';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private baseUrl = environment.apiSellUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

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

  getSubcategoriesByCatName(catName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subcategories`, { params: { catName } });
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getallCategories`);
  }
}

