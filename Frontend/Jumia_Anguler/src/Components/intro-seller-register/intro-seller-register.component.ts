import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SellNavbarComponent } from '../sell-navbar/sell-navbar.component';
import { SellFooterComponent } from '../sell-footer/sell-footer.component';

@Component({
  selector: 'app-intro-seller-register',
  imports: [ReactiveFormsModule,SellNavbarComponent,SellFooterComponent],
  templateUrl: './intro-seller-register.component.html',
  styleUrl: './intro-seller-register.component.css'
})
export class IntroSellerRegisterComponent {
  showForm = false;
  isLogin = false;
  showPassword = false;
  
  authForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      storeName: ['']
    });
  }

  showRegisterForm() {
    this.isLogin = false;
    this.showForm = true;
    this.authForm.get('storeName')?.setValidators([Validators.required]);
    this.authForm.get('storeName')?.updateValueAndValidity();
  }
  showLoginForm() {
    this.isLogin = true;
    this.showForm = true;
    this.authForm.get('storeName')?.clearValidators();
    this.authForm.get('storeName')?.updateValueAndValidity();
  }

  closeForm() {
    this.showForm = false;
    this.authForm.reset();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    if (this.authForm.valid) {
      const formData = this.authForm.value;
      if (this.isLogin) {
        // Handle login logic
        console.log('Login data:', formData);
      } else {
        // Handle registration logic
        console.log('Registration data:', formData);
      }
      this.closeForm();
    }
  }
  

}
