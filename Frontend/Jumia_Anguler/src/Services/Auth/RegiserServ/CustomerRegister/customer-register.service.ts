import { Injectable } from '@angular/core';
import { environment } from '../../../../Environment/Environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ICustomer } from '../../../../Models/icustomer';

@Injectable({
  providedIn: 'root'
})
export class CustomerRegisterService {

  private baseUrl = `${environment.apiUrl}/Auth/registeration`;

  constructor(
    private http: HttpClient,
    private router: Router // Inject Router
  ) { }

  register(user: ICustomer): Observable<any> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post(this.baseUrl, user, { headers, responseType: 'text' }).pipe(
      tap(response => {
        console.log('Registration successful', response);
      }),
      catchError(error => {
        console.error('Error during registration', error);
        return throwError(() => error);
      })
    );
  }
}
