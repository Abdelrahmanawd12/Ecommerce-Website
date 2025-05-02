import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { JumiaGlobalPopupComponent } from '../../jumia-global-bobup/jumia-global-bobup.component';
import { SellerRegisterService } from '../../../Services/Auth/RegiserServ/SellerRegister/seller-register.service';
import { CheckEmailUniquenessService } from '../../../Services/Auth/RegiserServ/EmailValidationUnique/check-email-uniqueness.service';

@Component({
  selector: 'app-sell-on-jumia',
  imports: [CommonModule, FormsModule, JumiaGlobalPopupComponent,RouterModule],
  templateUrl: './sell-on-jumia.component.html',
  styleUrls: ['./sell-on-jumia.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class SellOnJumiaComponent {
  @ViewChild(JumiaGlobalPopupComponent, { static: false }) jumiaPopup!: JumiaGlobalPopupComponent;

  constructor(private router: Router, private sellerRegServ: SellerRegisterService, private emailService: CheckEmailUniquenessService) { }

  currentStep = 0;
  steps = [1, 2, 3, 4, 5];

  aboutJumiaArr: string[] = [
    'Google',
    'Facebook',
    'Twitter',
    'LinkedIn',
    'Friends',
  ];
  abutJumia: string | null = null;
  countries: string[] = [
    'Egypt', 'Nigeria', 'Kenya', 'Morocco', 'Côte d\'Ivoire', 'Ghana',
    'Tanzania', 'Uganda', 'Senegal', 'Cameroon'
  ];
  country: string | null = null;

  selectCountry(selectedCountry: string): void {
    this.country = selectedCountry;
  }
  selectAboutJumia(selectedOption: string): void {
    this.abutJumia = selectedOption;
  }

  // Form data
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  storeName: string = '';
  shippingZone: string = '';
  storeAddress: string = '';
  firstName: string = '';
  lastName: string = '';
  gender: string | null = null;
  genderOptions: string[] = ['Male', 'Female'];
  firstNameError: boolean = false;
  lastNameError: boolean = false;
  genderError: boolean = false;
  dateOfBirth: Date | null = null;
  dateOfBirthError: boolean = false;
  emailError: string | null = null;

  // Error handling
  registrationError: string | null = null;

  // Error flags
  countryError: boolean = false;
  phoneError: boolean = false;
  passwordError: boolean = false;
  confirmPasswordError: boolean = false;
  storeNameError: boolean = false;
  shippingZoneError: boolean = false;
  storeAddressError: boolean = false;
  emailerr: boolean = false;
  lastStep = 4; 

  // UI states
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;

  stepHeaders = [
    { title: 'Sell on Jumia', subtitle: 'Choose the country of your shop' },
    { title: 'Setup Your Account', subtitle: 'Please provide your email address to create seller account' },
    { title: 'Personal Information', subtitle: 'setup your password and provide your phone number' },
    { title: 'Personal Information', subtitle: 'setup your FirstName and LastName and BirthDate' },
    { title: 'Shop Information', subtitle: 'setup your shop by completing the following details' }
  ];

  nextStep(): void {
    if (this.isValidStep()) {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    }
  }
  prevStep() {
    if (this.currentStep > 0) {
        this.currentStep--;
    }
} 

  checkEmailAvailability(): void {
    if (this.email) {
      this.emailService.checkEmailUnique(this.email).subscribe({
        next: (response) => {
          if (!response.success) {
            this.emailError = 'This Email is already taken';
          } else {
            this.emailError = null;
          }
        },
        error: () => {
          this.emailError = 'This Email is already taken';
        }
      });
    }
  }

  isValidStep(): boolean|string {
    switch (this.currentStep) {
      case 0:
        this.countryError = !this.country;
        return !this.countryError;
      case 1:
        this.emailerr = !this.email || !this.validateEmail(this.email);
      if (this.emailerr) {
        this.emailError = 'Email invalid'; 
      } else {
        this.checkEmailAvailability();
      }
        return !this.emailerr && !this.emailError; 
      case 2:
        this.phoneError = !this.validatePhone(this.phone);
        this.passwordError = !this.validatePassword(this.password);
        this.confirmPasswordError = this.password !== this.confirmPassword;
        return !this.phoneError && !this.passwordError && !this.confirmPasswordError;
      case 3:
        this.firstNameError = !this.firstName;
        this.lastNameError = !this.lastName;
        this.dateOfBirthError = !this.validateDateOfBirth(this.dateOfBirth);
        this.genderError = !this.gender;
        return !this.firstNameError && !this.lastNameError && !this.genderError && !this.dateOfBirthError;
        
      case 4:
        this.storeNameError = !this.storeName;
        this.shippingZoneError = !this.shippingZone;
        this.storeAddressError = !this.storeAddress;
        return !this.storeNameError && !this.shippingZoneError && !this.storeAddressError;
      default:
        return true;
    }
  }

  validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  validatePassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
    return regex.test(password);
  }

  validatePhone(phone: string): boolean {
    const regex = /^(010|011|012|015)\d{8}$/;
    return regex.test(phone);
  }

  validateDateOfBirth(date: Date | string | null): boolean {
    if (!date) return false;
  
    const birthDate = new Date(date); 
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
  
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
  
    return age >= 18;
  }
  

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  finishRegistration(): void {
    if (this.isValidStep()) {
      this.sellerRegServ
        .register(
          this.email,
          this.password,
          this.firstName,
          this.lastName,
          this.phone,
          this.dateOfBirth!,
          this.gender!,
          this.storeName,
          this.shippingZone,
          this.storeAddress,
        )
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            this.isLoading = true;

            this.router.navigate(['/registration-success']);
          },
          error: (error) => {
            console.error('Registration failed:', error);
            this.registrationError = error?.error?.message || 'Registration failed. Please try again.';
            this.isLoading = false;
          },
        });
  
    }
  }

  goToJumiaGlobal(): void {
    if (this.jumiaPopup) {
      this.jumiaPopup.openPopup();
    } else {
      console.error('JumiaGlobalPopupComponent is not initialized.');
    }
  }

  selectGender(selectedGender: string): void {
    this.gender = selectedGender;
  }
}
