import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordService } from '../../../Services/Auth/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  message: string = '';
  isLoading: boolean = false;
  messageType: 'success' | 'error' | null = null;
  isTimerVisible: boolean = false;
  countdown: number = 60;
  isButtonDisabled: boolean = false;
  private countdownInterval: any;
  isFocused = false;

  constructor(private forgotPasswordService: ForgotPasswordService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^\+?[0-9 ]{10,15}$/)])
    });

    this.forgotPasswordForm.statusChanges.subscribe(() => {
      this.updateButtonState();
    });
  }

  onInputChange() {
    if (this.messageType === 'error') {
      this.message = '';
      this.messageType = null;
    }
  }

  shouldShowErrors(controlName: string): boolean {
    const control = this.forgotPasswordForm.get(controlName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  onFieldInput(controlName: string) {
    const control = this.forgotPasswordForm.get(controlName);
    if (control) {
      control.markAsDirty(); 
    }
  }

  updateButtonState() {
    this.isButtonDisabled = this.forgotPasswordForm.invalid || this.isTimerVisible;
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.messageType = null;

    const email = this.forgotPasswordForm.get('email')?.value;

    this.forgotPasswordService.sendForgotPasswordEmail(email)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.message = response.message || 'Password reset link has been sent to your email.';
          this.messageType = 'success';
          this.startCountdown();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Forgot password error:', error);
          
          if (error?.error?.message === 'User not found.') {
            this.message = 'Email not found. Please check the email address and try again.';
          } else {
            this.message = error?.error?.message ||
              'There was an error sending the reset link. Please try again later.';
          }
          
          this.messageType = 'error';
          this.updateButtonState();
        }
      });
  }

  startCountdown() {
    this.isTimerVisible = true;
    this.countdown = 60;
    this.updateButtonState();
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.isTimerVisible = false;
        this.updateButtonState();
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}