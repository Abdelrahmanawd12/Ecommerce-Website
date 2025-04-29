import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  

  logout() {
    localStorage.removeItem('token');
    // this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string {
    const userData = localStorage.getItem('role');
    return userData ||'';
    // return userData ? JSON.parse(userData).role : '';
  }

  getUserId(): string {
    const userData = localStorage.getItem('userId');
    return userData ? JSON.parse(userData).userId : '';
  }
}
