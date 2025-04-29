import { CommonModule, NgIf } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CustomerRegisterService } from '../../Services/Auth/RegiserServ/CustomerRegister/customer-register.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { passwordStrength } from '../../Validation/PasswordMatched';
import { CheckEmailUniquenessService } from '../../Services/Auth/RegiserServ/EmailValidationUnique/check-email-uniqueness.service';
import { catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, Observable, of, take, tap } from 'rxjs';
import { OTPService } from '../../Services/Auth/OTPService/otp.service';

@Component({
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterLink],
  standalone: true,
  providers: [CustomerRegisterService],
  templateUrl: './customer-register.component.html',
  styleUrl: './customer-register.component.css'
})
export class CustomerRegisterComponent {

  currentView: 'email' | 'createPassword' | 'personalDetails' | 'additionalDetails' | 'accountCreated' | 'verification' = 'email';

  registerForm: FormGroup;

  isCaptchaVerified = false;
  captchaResolved = false;
  genders = ['Female', 'Male'];
  countries = ['Egypt', 'Nigeria', 'Kenya', 'Morocco'];
  prefixes = ['+20', '+234', '+254', '+212'];
  specialChars = '!@#$%^&* etc.';


  isSubmitting = false;
  email = '';
  showPassword = false;
  showConfirmPassword = false;
  // countdown: number = 0;

  redirectSeconds = 2;
  redirectInterval: any;
  countdown: number = 60;
  countdownInterval: any;
  isResendEnabled: boolean = false;

  isLoading: boolean = false;
  errorMessage: string = '';
  otp: string = '';
  message: string = '';
  verifymessage: string = '';
  isError = false;
  isVerifyClicked = false;


  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef>;
  emailError: string | null = null;

  constructor(private fb: FormBuilder, private customerRegisterService: CustomerRegisterService, private router: Router, private route: ActivatedRoute, private emailService: CheckEmailUniquenessService, private otpService: OTPService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^\+?[0-9 ]{10,15}$/)], [this.emailExistsValidator.bind(this)]],
      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required],
      digit5: ['', Validators.required],
      digit6: ['', Validators.required],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      prefix: ['+20', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), passwordStrength()]],
      BirthofDate: ['', [Validators.required, this.validateAge.bind(this)]],
      gender: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  get Email() { return this.registerForm.get('email') };
  get firstName() { return this.registerForm.get('firstName') };
  get lastName() { return this.registerForm.get('lastName') };
  get phoneNumber() { return this.registerForm.get('phoneNumber') };
  get password() { return this.registerForm.get('password') };
  get birthDate() { return this.registerForm.get('BirthofDate') };
  get gender() { return this.registerForm.get('gender') };

  startCountdown() {
    this.isResendEnabled = false;
    this.countdown = 60;
  
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.isResendEnabled = true; 
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }
  
  async nextStep() {
    switch (this.currentView) {
      case 'email':
        const emailControl = this.registerForm.get('email');

        // Force validation check
        emailControl?.markAsTouched();
        emailControl?.updateValueAndValidity();

        // Wait for pending validation
        if (emailControl?.pending) {
          await firstValueFrom(emailControl.statusChanges.pipe(
            filter(status => status !== 'PENDING'),
            take(1)
          ));
        }

        // Final check before proceeding
        if (emailControl?.invalid || emailControl?.hasError('emailExists')) {
          console.log('Cannot proceed - email issues:', emailControl?.errors);
          return; // Don't proceed if validation fails
        }

        // Proceed to next step
        this.currentView = 'verification';
        this.startCountdown();
        break;

      case 'verification':
        // Assuming verification logic here, proceed to next step
        this.currentView = 'createPassword';
        break;

      case 'createPassword':
        // Move to personal details step
        this.currentView = 'personalDetails';
        break;

      case 'personalDetails':
        // Move to additional details step
        this.currentView = 'additionalDetails';
        break;

      case 'additionalDetails':
        // Account creation complete
        this.currentView = 'accountCreated';
        break;

      default:
        console.error('Unknown view:', this.currentView);
        break;
    }
  }

  goBack() {
    switch (this.currentView) {
      case 'verification':
        this.currentView = 'email';
        break;
  
      case 'createPassword':
        this.currentView = 'verification';
        break;
  
      case 'personalDetails':
        this.currentView = 'createPassword';
        break;
  
      case 'additionalDetails':
        this.currentView = 'personalDetails';
        break;
  
      case 'accountCreated':
        this.currentView = 'additionalDetails';
        break;

      case 'email':
        window.history.back();
        break;
  
      default:
        console.error('Unknown view:', this.currentView);
        break;
    }
  }
  
  resendCode(event: MouseEvent): void {
    event.preventDefault();
  
    if (this.isResendEnabled) {
      const emailEntered = this.registerForm.get('email')?.value.trim().toLowerCase();
  
      this.otpService.sendOtp(emailEntered).subscribe({
        next: (response) => {
          console.log('✅ Verification code resent.');
          this.startCountdown(); 
        },
        error: (error) => {
          console.error('❌ Failed to resend verification code.', error);
        }
      });
    }
  }
  
  

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = {
        ...this.registerForm.value,
        email: this.registerForm.value.email
      };
      delete formData.emailOrPhone;

      this.customerRegisterService.register(formData).subscribe({
        next: () => {
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: () => {
          alert('Error while registering. Please try again.');
        }
      });
    }
  }

  get passwordStrength() {
    const password = this.registerForm.get('password')?.value;
    if (!password) return '';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength =
      (password.length >= 8 ? 1 : 0) +
      (hasUpperCase ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasNumber ? 1 : 0) +
      (hasSpecialChar ? 1 : 0);
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }

  get maxDate(): Date {
    const today = new Date();
    return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  }

  onTermsChange() {
    this.registerForm.get('terms')?.updateValueAndValidity();
  }  

  validateAge(control: AbstractControl): ValidationErrors | null {
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 18) {
      return { underAge: true };
    }
    return null;
  }

  getBirthDateErrors() {
    const birthDateControl = this.registerForm.get('birthDate');
    return {
      required: birthDateControl?.hasError('required'),
      underAge: birthDateControl?.hasError('underAge')
    };
  }

  redirectToHome() {
    console.log('Redirecting to home page...');
  }

  emailExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
  
    return this.emailService.checkEmailUniquebool(control.value).pipe(
      map(response => {
        if (response.exists) {
          return { emailExists: true };
        }
        return null;
      }),
      catchError((error: HttpErrorResponse) => {
        // For 400 errors, return both apiError and emailExists
        if (error.status === 400) {
          return of({
            apiError: 'Invalid email format or already exists',
            emailExists: true
          });
        }
        return of(null);
      }),
      take(1)
    );
  }

  loginWithFacebook() {
    console.log('Login with Facebook');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { 'mismatch': true };
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length === 1 && index < 6) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onBackspace(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 1) {
      const previousInput = input.previousElementSibling as HTMLInputElement;
      if (previousInput) {
        previousInput.focus();
      }
    }
  }


  getEnteredCode(): string {
    return [
      this.registerForm.get('digit1')?.value,
      this.registerForm.get('digit2')?.value,
      this.registerForm.get('digit3')?.value,
      this.registerForm.get('digit4')?.value,
      this.registerForm.get('digit5')?.value,
      this.registerForm.get('digit6')?.value,
    ].join('');
  }

  onSendOtp(): void {
    const email = this.registerForm.get('email')?.value;
    if (!email || email.trim() === '') {
      this.message = 'Please enter a valid email address';
      return;
    }
    this.otpService.sendOtp(email).subscribe({
      next: (response) => {
        this.message = response.message;
      },
      error: (error) => {
        this.message = error.error?.message || 'Error sending OTP';
      }
    });
  }

  onVerifyOtp(): void {
    const otp = this.getEnteredCode();
    this.otpService.verifyOtp(this.email, otp).subscribe({
      next: (response) => {
        this.verifymessage = response.message;
      },
      error: (error) => {
        this.verifymessage = 'Invalid or expired OTP';
      }
    });
  }

  onVerifyClick() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.isVerifyClicked = true;

    const otp = this.getEnteredCode();
    const emailEntered = this.registerForm.get('email')?.value.trim().toLowerCase();

    this.otpService.verifyOtp(emailEntered, otp).subscribe({
      next: (response) => {
        this.verifymessage = response.message;
        this.isError = false;
        this.isSubmitting = false;
        this.nextStep();
      },
      error: (error) => {
        this.verifymessage = error.error?.message || 'Invalid or expired OTP';
        this.isError = true;
        this.isSubmitting = false;
      }
    });
  }



  onContinueClick() {
    if (this.registerForm.get('email')?.invalid) {
      this.message = 'Please enter a valid email address';
      return;
    }
    this.nextStep();
    this.onSendOtp();
  }



  ngOnInit() {
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });

    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });

    this.registerForm.get('email')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.registerForm.get('email')?.markAsDirty();
        this.registerForm.get('email')?.updateValueAndValidity();
      })
    ).subscribe();
  }
}
