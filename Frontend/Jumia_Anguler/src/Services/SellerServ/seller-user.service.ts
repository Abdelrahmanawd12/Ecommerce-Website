import { Injectable } from '@angular/core';
import { environment } from '../../Environment/Environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  editSeller(id: string, updatedSeller: Seller): Observable<Seller> {
    return this.http.put<Seller>(`${this.baseUrl}/UserSeller/editSeller`, updatedSeller, {
      params: { id }
    });
  }  

  updatePassword(id: string, oldPassword: string, newPassword: string): Observable<any> {
    const passwordDto = {
      OldPassword: oldPassword,
      NewPassword: newPassword
    };

    return this.http.patch<any>(`${this.baseUrl}/UserSeller/updatePassword?id=${id}`, passwordDto, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
