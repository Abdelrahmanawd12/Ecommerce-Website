import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../Environment/Environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CreateShipmentService {

    private baseUrl = environment.apiSellUrl;
  
  constructor(private http: HttpClient) { }

  createShipment(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/shipping/create`, order);
  }  
}
