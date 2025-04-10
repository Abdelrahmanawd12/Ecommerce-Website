import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { CustomerRegisterService } from '../../Services/Auth/RegiserServ/CustomerRegister/customer-register.service';
import { Router } from '@angular/router';
import { passwordMatched, passwordStrength } from '../../Validation/PasswordMatched';

@Component({
  selector: 'app-customer-register',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RecaptchaModule],
  providers: [CustomerRegisterService],
  templateUrl: './customer-register.component.html',
  styleUrl: './customer-register.component.css'
})
export class CustomerRegisterComponent{

  currentView: 'email' | 'verification' | 'createPassword' | 'personalDetails' | 'additionalDetails' | 'captchaVerification'| 'phoneVerification' | 'accountCreated' = 'email';
  
 
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

  userName = 'Yasmin';
  redirectSeconds = 2;
  redirectInterval: any;

  
  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef>;

  constructor(private fb: FormBuilder, private customerRegisterService: CustomerRegisterService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^\+?[0-9 ]{10,15}$/)]],      
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Basic validation for phone number
      prefix: ['+20', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8),passwordStrength()]],
      BirthofDate: ['', [Validators.required, this.validateAge.bind(this)]],
      gender: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  get Email() {return this.registerForm.get('email')};
  get firstName() {return this.registerForm.get('firstName')};
  get lastName() {return this.registerForm.get('lastName')};
  get phoneNumber() {return this.registerForm.get('phoneNumber')};
  get password() {return this.registerForm.get('password')};
  // get confirmPassword() {return this.registerForm.get('confirmPassword')};
  get birthDate() {return this.registerForm.get('BirthofDate')};
  get gender() {return this.registerForm.get('gender')};

  nextStep() {
    switch (this.currentView) {
      case 'email':
        this.currentView = 'createPassword';
        break;
      case 'createPassword':
        this.currentView = 'personalDetails';
        break;
      case 'personalDetails':
        this.currentView = 'additionalDetails';
        break;
      case 'additionalDetails':
        this.currentView = 'accountCreated';
        break;
      default:
        break;
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
            this.router.navigate(['/home']); 
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

  ngOnInit() {
      this.registerForm.get('password')?.valueChanges.subscribe(() => {
        this.registerForm.get('confirmPassword')?.updateValueAndValidity();
      });
      
      this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
        this.registerForm.get('confirmPassword')?.updateValueAndValidity();
      });
    }
}