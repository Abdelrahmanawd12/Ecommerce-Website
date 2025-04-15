import { Injectable } from '@angular/core';
import { environment } from '../../Environment/Environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Seller } from '../../Models/seller';

@Injectable({
  providedIn: 'root'
})
export class SellerUserService {

  private baseUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }


  getSellerInfo(id:string): Observable<Seller> {
    return this.http.get<Seller>(`${this.baseUrl}/UserSeller/sellerInfo`, { params: { id } });
  }
  
}
