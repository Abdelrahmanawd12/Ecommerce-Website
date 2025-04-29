import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Environment/Environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OTPService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Send OTP to the email
  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/send-otp`, { email });
  }

  // Verify OTP entered by the user
  verifyOtp(email: string, otp: string): Observable<any> {
    const body = { email, otp };
    return this.http.post(`${this.apiUrl}/auth/verify-otp`, body);
  }
}
