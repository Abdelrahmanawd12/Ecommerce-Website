import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports:[DatePipe],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent {
  // Sample data - replace with real data
  amount = 99.99;
  email = 'user@example.com';
  transactionId = 'TRX-123456';
  transactionDate = new Date();

  constructor(private router: Router) {}

  confirmPayment(): void {
    // Show Toast message
    this.showToast();
    
    // Redirect to home page after 3 seconds
    setTimeout(() => {
      this.router.navigate(['/home']); // Change '/home' to your actual home route
    }, 3000);
  }

  private showToast(): void {
    const toast = document.createElement('div');
    toast.className = 'toast show position-fixed bottom-0 end-0 m-3';
    toast.style.zIndex = '1100';
    toast.innerHTML = `
      <div class="toast-header bg-success text-white">
        <strong class="me-auto">Payment Successful</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        ✅ Payment confirmed successfully! Redirecting to homepage...
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}