import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../Environment/Environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CheckEmailUniquenessService {

  private baseUrl = environment.apiUrl + '/auth/sellerRegisteration';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  checkEmailUnique(email: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/auth/check-email?email=${email}`);
  }
}
