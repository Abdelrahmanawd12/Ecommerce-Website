import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Environment/Environment.prod';
import { SearchResponse } from '../Models/search-response';

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
  private baseUrl = 'https://localhost:7266/api/admin/product'
  readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: Product): Observable<any> {
    return this.http.post(this.baseUrl, product);
  }

  updateProduct(product: Product): Observable<any> {
    return this.http.put(`${this.baseUrl}/${product.productId}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  Search(query: string): Observable<SearchResponse[]> {
    return this.http.get<SearchResponse[]>(`${this.apiUrl}/products/search?query=${encodeURIComponent(query)}`);
  }
  
}
