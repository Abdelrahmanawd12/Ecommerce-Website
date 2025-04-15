import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesReportService {
  private apiUrl = 'https://api.example.com/reports'; // API endpoint

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getReports(startDate: string, endDate: string, categoryId: string): Observable<any> {
    const params = { startDate, endDate, categoryId };
    return this.http.get<any>(`${this.apiUrl}/sales`, { params });
  }
}
