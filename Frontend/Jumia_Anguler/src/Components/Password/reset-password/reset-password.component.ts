import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ForgotPasswordService } from '../../../Services/Auth/forgot-password.service';
import { passwordStrength } from '../../../Validation/PasswordMatched';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetForm!: FormGroup;
  token!: string;
  email!: string;
  isLoading: any;
  errorMessage: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private passwordResetService: ForgotPasswordService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), passwordStrength(), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordStrengthValidator(control: any) {
    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasUpperCase) {
      return { noUpperCase: true };
    }
    if (!hasLowerCase) {
      return { noLowerCase: true };
    }
    if (!hasNumber) {
      return { noNumber: true };
    }
    if (!hasSpecialChar) {
      return { noSpecialChar: true };
    }
    return null;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  getPasswordErrors() {
    const errors = this.resetForm.get('newPassword')?.errors;
    if (!errors) return null;
    
    return {
      noUpperCase: errors['noUpperCase'] ? 'At least one uppercase letter (A-Z)' : null,
      noLowerCase: errors['noLowerCase'] ? 'At least one lowercase letter (a-z)' : null,
      noNumber: errors['noNumber'] ? 'At least one number (0-9)' : null,
      noSpecialChar: errors['noSpecialChar'] ? 'At least one special character (!@#$%^&*)' : null,
      minlength: errors['minlength'] ? 'Minimum 8 characters required' : null,
      required: errors['required'] ? 'Password is required' : null
    };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.errorMessage = '';
      const { newPassword } = this.resetForm.value;
      this.isLoading = true;
      this.passwordResetService.resetPassword(this.token, this.email, newPassword)
        .subscribe(
          response => {
            console.log('Password reset successful!', response);
            this.isLoading = false;
            this.router.navigate(['/login']);
          },
          error => {
            console.error('Password reset failed!', error);
            this.isLoading = false;
            if (error.error) {
              if (error.error.errors && Array.isArray(error.error.errors) && error.error.errors.length > 0) {
                const firstError = error.error.errors[0];
                this.errorMessage = typeof firstError === 'string'
                  ? firstError
                  : (firstError?.message || firstError?.errorMessage || 'Something went wrong.');
              } else if (error.error.message) {
                this.errorMessage = error.error.message;
              } else {
                this.errorMessage = 'Something went wrong. Please try again.';
              }
            } else {
              this.errorMessage = 'This reset link has already been used or is invalid.';
            }
          }          
        );
    }
  }  
}