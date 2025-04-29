import { Injectable } from '@angular/core';
import { environment } from '../../Environment/Environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddress } from '../../Models/iaddress';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  
  private baseUrl = environment.apiSellUrl;

  constructor(private http: HttpClient) {}

  getAddresses(customerId: string): Observable<IAddress[]> {
    return this.http.get<IAddress[]>(`${this.baseUrl}/address?customerId=${customerId}`);
  }

  addAddress(userId: string, address: IAddress): Observable<any> {
    return this.http.post(`${this.baseUrl}/address`, address);
   }
}