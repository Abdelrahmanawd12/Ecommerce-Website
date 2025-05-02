import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../Services/Auth/LoginServ/login.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  standalone: true,
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,private loginService: LoginService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^\+?[0-9 ]{10,15}$/)]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    })
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe')}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }
  
    this.isLoading = true;
    const { email, password, rememberMe } = this.loginForm.value;
  
    this.loginService.GetuserbyEmail(email, rememberMe).subscribe({
      next: (response) => {
        console.log('Remmember Me: ', rememberMe)
        console.log('User response from API:', response); 
        if (!response || !response.id || !response.role) {
          this.isLoading = false;
          this.errorMessage = 'User not found';
          return;
        }
  
        const userRole = response.role;
        const userId = response.id;
  
        this.loginService.setUserInfo(userId, userRole, rememberMe);
  
        this.loginService.login(email, password, rememberMe).subscribe({
          next: (loginResponse) => {
            this.isLoading = false;
            console.log('Login Response:', loginResponse); 
            console.log('Passing userRole to redirect:', userRole);
  
            this.redirectBasedOnRole(userRole);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Invalid email or password';
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'User not found';
      }
    });
  }  
   

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private redirectBasedOnRole(roles: string | string[]): void {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    console.log('role in redirectBasedOnRole: '+roles)
    if (rolesArray.includes('Admin')) {
      this.router.navigate(['/admin-dashboard']);
    } else if (rolesArray.includes('Seller')) {
      this.router.navigate(['/sellerDashboard']);
    } else if (rolesArray.includes('Customer')) {
      window.location.href = '/home';      
    }
  }
  
  
  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  navigateToSellerCenter(): void {
    this.router.navigate(['/seller-register']);
  }

  forgotPassword(): void {
    this.router.navigate(['/forgotpassword']);
  }

}
