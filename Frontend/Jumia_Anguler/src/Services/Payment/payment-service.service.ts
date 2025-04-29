// services/payment.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../Environment/Environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripePromise = loadStripe('pk_test_51RFwXyFx7OicCmbiq5vA049rtXGwZjAQz6FZHxGnd0h99VOHLhwWkXbzVRIWcLCflRmMpe3uEnauXwKmvwHUFf9T00SK20SNLr'); 

  constructor(private http: HttpClient) {}

  createCheckoutSession(amount: number, successUrl: string, cancelUrl: string) {
    return this.http.post<{ sessionId: string }>(`${environment.apiSellUrl}/checkout-session`, {
      amount,
      successUrl,
      cancelUrl
    });
  }

  async redirectToCheckout(sessionId: string) {
    const stripe = await this.stripePromise;
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId });
    } else {
      console.error('Stripe.js failed to load.');
    }
  }
}
