import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../Environment/Environment.prod';
import { SearchResponse } from '../../Models/search-response';
import { IProduct } from '../../Models/Category';

export interface Product {
  productId?: number; 
  name: string;
  description: string;
  price: number;
  quantity: number;
  brand: string;
  discount: number;
  weight: number;
  subCategoryName: string;
  imageUrls: string[];
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // private baseUrl = 'https://localhost:7266/api/admin/product'
  readonly apiUrl = environment.apiUrl;
  readonly apiUrl2 = environment.apiSellUrl;

  constructor(private http: HttpClient) {}

  // getAllProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.baseUrl);
  // }

  // getProductById(id: number): Observable<Product> {
  //   return this.http.get<Product>(`${this.baseUrl}/${id}`);
  // }

  // createProduct(product: Product): Observable<any> {
  //   return this.http.post(this.baseUrl, product);
  // }

  // updateProduct(product: Product): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${product.productId}`, product);
  // }

  // deleteProduct(id: number): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/${id}`);
  // }

  Search(query: string): Observable<SearchResponse[]> {
    return this.http.get<SearchResponse[]>(`${this.apiUrl}/products/search?query=${encodeURIComponent(query)}`);
  }
  
  getAllPendingProducts():Observable<IProduct[]>{
    return this.http.get<IProduct[]>(`${this.apiUrl2}/request`);
  }

  getSellerName(productId: number): Observable<any> {
    return this.http.get(`${this.apiUrl2}/sellerName`, {
      params: { productId }, 
      responseType: 'text'  
    });
    
  }
  changeProductStatus(productId: number, newStatus: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl2}/changeStatus?productId=${productId}`,
      JSON.stringify(newStatus), 
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text'
      }
    );
  }
  
}
