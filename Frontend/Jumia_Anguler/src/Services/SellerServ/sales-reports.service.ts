import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProductSales } from '../../Models/iproduct-sales';
import { ISellerProfit } from '../../Models/iseller-profit';
import { environment } from '../../Environment/Environment.prod';
import { ISalesovertime } from '../../Models/isalesovertime';
import { ILowstockproduct } from '../../Models/ilowstockproduct';
import { CustomerInsights } from '../../Models/customer-insights';
import { OrderSummary } from '../../Models/order-summary';
import { ReturnReport } from '../../Models/return-report';
import { TopSellingProduct } from '../../Models/topselling-product';
import { BestSalesTime } from '../../Models/sales-timing';

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

  getAvgOrderValue(sellerId:string):Observable<any>{
    const params = new HttpParams().set('sellerId', sellerId);
    return this.http.get(`${this.apiUrl}/averageOrderValue`, { params });
  }

  getSalesOverTime(sellerId:string):Observable<ISalesovertime[]>{
    const params = new HttpParams().set('sellerId', sellerId);
    return this.http.get<ISalesovertime[]>(`${this.apiUrl}/salesOverTime`, { params });
  }

  getLowStock(sellerId:string):Observable<ILowstockproduct[]>{
    const params = new HttpParams().set('sellerId', sellerId);
    return this.http.get<ILowstockproduct[]>(`${this.apiUrl}/lowStockProducts`, { params });
  }
//--------------------------------------------------------------------------------------------------
  getCustomerInsights(sellerId: string): Observable<CustomerInsights> {
    const params = new HttpParams().set('sellerId', sellerId);
    return this.http.get<CustomerInsights>(`${this.apiUrl}/customerInsights`, { params });
  }
  
  getReturnReport(sellerId: string): Observable<ReturnReport[]> {
    const params = new HttpParams().set('sellerId', sellerId);
    return this.http.get<ReturnReport[]>(`${this.apiUrl}/returnReport`, { params });
  }
  
  getTopSellingProducts(sellerId: string): Observable<TopSellingProduct[]> {
    const params = new HttpParams().set('sellerId', sellerId);
    return this.http.get<TopSellingProduct[]>(`${this.apiUrl}/topSellingProducts`, { params });
  }
  
  getOrdersSummary(sellerId: string): Observable<OrderSummary> {
    const params = new HttpParams().set('sellerId', sellerId);
    return this.http.get<OrderSummary>(`${this.apiUrl}/ordersSummary`, { params });
  }
  
  getBestSalesTimes(sellerId: string): Observable<BestSalesTime> {
    const params = new HttpParams().set('sellerId', sellerId);
    return this.http.get<BestSalesTime>(`${this.apiUrl}/salesTiming`, { params });
  }
  
}
