import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../Environment/Environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  readonly url = `${environment.apiUrl}/auth`;
  
  constructor(private http: HttpClient) { }

  sendForgotPasswordEmail(email: string): Observable<any> {
    return this.http.post(`${this.url}/forgot-password`, { email }).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(error);
      })
    );
  }

  resetPassword(token: string, email: string, newPassword: string): Observable<any> {
    const resetData = { token, email, newPassword };
    return this.http.post(`${this.url}/reset-password`, resetData);
  }
}
