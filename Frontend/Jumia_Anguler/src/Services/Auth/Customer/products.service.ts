import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../../../Models/Category';
import { environment } from '../../../Environment/Environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {


  // private apiUrl = 'https://localhost:7266/api/Products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${environment.apiUrl}/Products`);
  }
  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${environment.apiUrl}/Products/${id}`);
  }
}
