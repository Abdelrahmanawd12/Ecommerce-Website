import { Injectable } from '@angular/core';
import { environment } from '../../../../Environment/Environment.prod';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class CustomerRegisterService {

  private baseUrl = `${environment.apiUrl}/auth/registeration`;

  constructor(
    private http: HttpClient,
    private router: Router, // Inject Router
    private toastr: ToastrService // Inject ToastrService
  ) { }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    dateOfBirth: Date,
    gender: string,
    street: string,
    country: string,
    city: string
  ): any {
    const addresses = [{
      Street: street,
      City: city,
      Country: country
    }];

    const payload = {
      Email: email,
      Password: password,
      FirstName: firstName,
      LastName: lastName,
      PhoneNumber: phoneNumber,
      DateOfBirth: dateOfBirth,
      Gender: gender,
      Addresses: addresses
    };

    return this.http.post(this.baseUrl, payload).pipe(
      tap(response => {
        // Success handling: Show toast & navigate to login page
        this.toastr.success('Account created successfully!', 'Success');
        this.router.navigateByUrl('/login'); // Redirect to login page after successful registration
      }),
      catchError(error => {
        // Error handling: Show error toast
        this.toastr.error('Registration failed. Please try again.', 'Error');
        return throwError(error); // Re-throw error to propagate it
      })
    );
  }
}
