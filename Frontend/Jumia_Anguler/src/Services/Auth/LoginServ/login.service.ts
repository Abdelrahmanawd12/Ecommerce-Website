import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../Environment/Environment';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { LoginResponse } from '../../../Models/login-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.apiUrl;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private isLogged = false;


  constructor(private http: HttpClient) { }

  /**
   * Logs in the user by sending a POST request to the API with the provided email and password.
   * If successful, it stores the token and user info in local storage and updates the logged-in state.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An observable of the login response containing the token and user info.
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + '/auth/login', { email, password }).pipe(
      tap(response => {
        this.setToken(response.token);  
        this.isLoggedInSubject.next(true);
        this.isLogged = true;
      }),
      catchError(error => {
        console.error('Login error', error);
        return throwError(() => error);
      })
    );
  }

  GetuserbyEmail(email: string): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(`${this.baseUrl}/auth/userByEmail?email=${email}`).pipe(
      tap(response => {
        if (response && response.role) {
          if (response.token) {
            this.setToken(response.token);
          }
          this.isLoggedInSubject.next(true);
        } else {
          console.error('No role found in user data', response);
        }
      }),
      catchError(error => {
        console.error('Error fetching user by email', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logs out the user by clearing the token and user info from local storage and updating the logged-in state.
   */
  logout(): void {
    this.clearToken();
    this.clearUserInfo();
    this.isLoggedInSubject.next(false);

  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    sessionStorage.setItem('token', token); // Optional: Store in sessionStorage as well
  }

  public setUserInfo(userId: string, role: string): void {
  if (userId && role) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
  }
}

  private clearToken(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  private clearUserInfo(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('roles');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Optional: Check if the user is logged in based on the presence of a token
  // This can be used in guards or components to determine if the user is authenticated
  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // Optional: Get the token for API requests
  // Optional: Helper to get user info later
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Optional: Get the roles of the user for authorization checks
  // This can be used to check if the user has specific roles for accessing certain routes or features
  getUserRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }


}
