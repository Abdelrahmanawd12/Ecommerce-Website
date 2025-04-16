import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProductSales } from '../../Models/iproduct-sales';
import { ISellerProfit } from '../../Models/iseller-profit';
import { environment } from '../../Environment/Environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SalesReportService {
  private apiUrl = environment.apiSellUrl; // API endpoint

  constructor(private http: HttpClient) { }

  getProductSales(): Observable<IProductSales[]> {
    return this.http.get<IProductSales[]>(`${this.apiUrl}/productSales`);
  }

  getSellerProfits(sellerId: string): Observable<ISellerProfit> {
    const params = new HttpParams().set('sellerId', sellerId);
    return this.http.get<ISellerProfit>(`${this.apiUrl}/profits`, { params });
  }
}
