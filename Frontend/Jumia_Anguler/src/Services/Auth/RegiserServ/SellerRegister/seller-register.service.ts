import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../Environment/Environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface RegisterResponse {
  message: string;
  success: boolean;
  token: string;  
}

@Injectable({
  providedIn: 'root'
})
export class SellerRegisterService {

  private baseUrl = environment.apiUrl + '/auth/sellerRegisteration';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    dateOfBirth: Date,
    gender: string,
    storeName: string,
    shippingZone: string,
    storeAddress: string
  ): Observable<RegisterResponse> {

    const payload = {
      Email: email,
      Password: password,
      FirstName: firstName,
      LastName: lastName,
      PhoneNumber: phoneNumber,
      DateOfBirth: dateOfBirth,
      Gender: gender,
      StoreName: storeName,
      ShippingZone: shippingZone,
      StoreAddress: storeAddress
    };

    return this.http.post<RegisterResponse>(this.baseUrl, payload, { headers: { 'Content-Type': 'application/json' } }).pipe(
      tap(response => {
        if (response.success) {
          // Save token to localStorage
          localStorage.setItem('authToken', response.token);  

          console.log(response.message);
          this.router.navigate(['/seller/dashboard']);
        } else {
          console.error(response.message);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = error.error?.message || 'An unknown error occurred.';
      
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            try {
              errorMessage = error?.error?.message || 'Invalid input data.';
            } catch (e) {
              errorMessage = 'Unexpected response format from server.';
            }
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        }
      
        if (error.error instanceof ProgressEvent) {
          return throwError(() => 'Server error occurred');
        }
        return throwError(() => errorMessage);
      })
    );
  }
}
