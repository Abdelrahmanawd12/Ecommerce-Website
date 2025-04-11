import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
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

  checkEmailUniquebool(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(
      `${environment.apiUrl}/auth/check-email?email=${encodeURIComponent(email)}`
    ).pipe(
      catchError(error => {
        // Convert 400 error to meaningful response
        if (error.status === 400) {
          return of({ exists: true }); // Treat as existing if API rejects
        }
        return throwError(error);
      })
    );
  }

}
