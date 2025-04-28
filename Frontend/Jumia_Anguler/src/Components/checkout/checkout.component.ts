import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';
import { IOrder } from '../../Models/iorder';
import { CommonModule, DatePipe } from '@angular/common';
import { PaymentService } from '../../Services/Payment/payment-service.service';
import { CheckoutService } from '../../Services/Checkout/checkout.service';
import { environment } from '../../Environment/Environment.prod';
import { ChangeDetectorRef } from '@angular/core';
import { Icheckout } from '../../Models/icheckout';
import { Router } from '@angular/router';
import { CartService } from '../../Services/Customer/cart.service';
import { AddressService } from '../../Services/AddressService/address.service';
import { PaypalService } from '../../Services/paypal.service';


@Component({
  selector: 'app-checkout',
  imports: [DatePipe, ReactiveFormsModule, CommonModule,FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  paymentMethod: string = 'cod';
  stripe: any;
  card: any;
  elements: any;
  stripeLoading: boolean = false;
  paypalLoading: boolean = false;
  cardErrors: string | null = null;
  shipping: number = 65;
  readonly imgBase = environment.imageBaseUrl;

  selectedAddress: string | null = null;
  saveAddress: boolean = false;
  userId = localStorage.getItem('userId') || '';

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private paypalService: PaypalService, 
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private addressService: AddressService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      shipping: this.fb.group({
        receiverName: ['', Validators.required],
        recieverEmail: ['', [Validators.required, Validators.email]],
        receiverPhone: ['', Validators.required],
        shippingAddress: ['', Validators.required],
        shippingMethod: ['standard', Validators.required]
      }),
      paymentMethod: ['cod', Validators.required],
      billingSameAsShipping: [true],
      billingInfo: this.fb.group({
        billingAddress: [''],
        billingCity: [''],
        billingZip: ['']
      })
    });
    this.updateBillingAddressValidators(true);
  }

  private updateBillingAddressValidators(isSame: boolean) {
    const billingInfo = this.checkoutForm.get('billingInfo');
    if (isSame) {
      billingInfo?.get('billingAddress')?.clearValidators();
      billingInfo?.get('billingCity')?.clearValidators();
      billingInfo?.get('billingZip')?.clearValidators();
      billingInfo?.get('billingAddress')?.setValue('');
      billingInfo?.get('billingCity')?.setValue('');
      billingInfo?.get('billingZip')?.setValue('');
    } else {
      billingInfo?.get('billingAddress')?.setValidators([Validators.required]);
      billingInfo?.get('billingCity')?.setValidators([Validators.required]);
      billingInfo?.get('billingZip')?.setValidators([Validators.required]);
    }
    billingInfo?.get('billingAddress')?.updateValueAndValidity();
    billingInfo?.get('billingCity')?.updateValueAndValidity();
    billingInfo?.get('billingZip')?.updateValueAndValidity();
  }

  getDeliveryDate(method: string): Date {
    const now = new Date();
    switch (method) {
      case 'express':
        now.setDate(now.getDate() + 2);
        break;
      case 'overnight':
        now.setDate(now.getDate() + 1);
        break;
      default:
        now.setDate(now.getDate() + 5);
        break;
    }
    return now;
  }
  readonly orderString = localStorage.getItem('order') || '';
  readonly order = JSON.parse(this.orderString);

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      shipping: this.fb.group({
        receiverName: ['', Validators.required],
        recieverEmail: ['', [Validators.required, Validators.email]],
        recieverPhone: ['', Validators.required],
        shippingAddress: ['', Validators.required],
        shippingMethod: ['standard'],
        deliveryDate: [this.getDeliveryDate('standard')],
        billingSameAsShipping: [true],
        billingInfo: this.fb.group({
          billingAddress: [''],
          billingCity: [''],
          country: ['Egypt']
        })
      }),
      paymentMethod: ['cod', Validators.required]
    });

    this.checkoutForm.get('shipping.shippingMethod')?.valueChanges.subscribe(method => {
      const newDate = this.getDeliveryDate(method);
      this.checkoutForm.get('shipping.deliveryDate')?.setValue(newDate);
    });
    this.addressService.getAddresses(this.userId).subscribe({
      next: address => {
        if (address) {
          this.selectedAddress = address.length > 0 ? address[0].street+','+ address[0].city+','+ address[0].country : null;
          this.checkoutForm.get('shipping.shippingAddress')?.setValue(this.selectedAddress);
        }
      },
      error: err => console.error('Error fetching address:', err)
    });
  }
  get isBillingDifferent() {
    return !this.checkoutForm.get('billingSameAsShipping')?.value;
  }
  setupStripeElements() {
    const elements = this.stripe.elements();
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    this.card = elements.create('card', { style });
    this.card.mount('#card-element');
    this.card.on('change', (event: any) => {
      this.cardErrors = event.error?.message || null;
    });
  }

  async onSubmit() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const orderData = await this.prepareOrderData();
    if (this.saveAddress) {
      const address = this.checkoutForm.get('shipping.shippingAddress')?.value;
      this.addressService.addAddress(this.userId, address).subscribe({
        next: () => console.log('Address saved'),
        error: err => console.error('Error saving address:', err)
      });
    }

   
    switch (this.paymentMethod) {
      case 'cod':
        this.processCashOnDelivery(orderData);
        break;
      case 'stripe':
        await this.processStripePayment(orderData);
        break;
      case 'paypal':
        await this.processPayPalPayment(orderData);
        break;
    }
    // if (this.paymentMethod === 'cod') {
    //   this.processCashOnDelivery(orderData);
    // } else if (this.paymentMethod === 'stripe') {
    //   await this.processStripePayment(orderData);
    // }
  }
  async prepareOrderData(): Promise<Icheckout> {
    const formValue = this.checkoutForm.value;
    const now = new Date();
    const customerId = localStorage.getItem('userId') || '';

    const sellerIds: string[] = await Promise.all(
      this.order.items.map((item: any) =>
        this.checkoutService.getSellerIdByProductId(item.productId).toPromise()
      )
    );

    const sellerId = sellerIds[0];
    console.log('SellerId:', sellerId);

    return {
      customerId,
      sellerId,
      paymentMethod: formValue.paymentMethod,
      shippingAddress: formValue.shipping.shippingAddress,
      items: this.order.items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        productImageUrl: item.imageUrl,
        quantity: item.quantity,
        subTotal: item.price * item.quantity
      })),
      cartItems: this.order.items.map((item: any, index: number) => ({
        productId: item.productId,
        sellerId: sellerIds[index],
        quantity: item.quantity,
        unitPrice: item.price
      })),
      shipping: {
        shippingMethod: formValue.shipping.shippingMethod,
        shippingAddress: formValue.shipping.shippingAddress,
        deliveryDate: formValue.shipping.deliveryDate,
        shippingStatus: 'preparing',
        receiverName: formValue.shipping.receiverName,
        receiverPhone: formValue.shipping.recieverPhone,
        receiverEmail: formValue.shipping.recieverEmail,
        shippingDate: now.toISOString(),
        trackingNumber: Math.floor(Math.random() * 1000000000).toString()
      },
      payment: {
        paymentMethod: formValue.paymentMethod,
        amount: this.calculateTotal(),
        paymentDate: now.toISOString(),
        status: formValue.paymentMethod === 'cod' ? 'pending' : 'Paid',
        transactionId: '',
      },
      orderItems: this.order.items.map((item: any) => ({
        productName: item.productName,
        brand: item.brand,
        quantity: item.quantity,
        price: item.price,
        SubTotalPrice: item.price * item.quantity,
        imageUrls: Array.isArray(item.imageUrl) ? item.imageUrl : [item.imageUrl]
      }))
    };
  }



  processCashOnDelivery(orderData: Icheckout) {
    this.checkoutService.checkout(orderData).subscribe({
      next: () => {
        this.router.navigate(['/order-success']),
          localStorage.removeItem('order');
        this.clearCartFromDatabase();
      },
      error: err => console.error('Checkout error:', err)

    });
  }
  async processStripePayment(orderData: Icheckout) {
    this.stripeLoading = true;

    try {
      const successUrl = window.location.origin + '/success';
      const cancelUrl = window.location.origin + '/cancel';

      this.paymentService.createCheckoutSession(orderData.payment.amount, successUrl, cancelUrl)
        .subscribe(async res => {
          if (res.sessionId) {
            const stripe = await loadStripe(environment.stripePublishableKey);
            if (stripe) {
              stripe.redirectToCheckout({ sessionId: res.sessionId });
            }
          }
        });

      this.checkoutService.checkout(orderData).subscribe({
        next: () => {
          localStorage.removeItem('order');
          this.clearCartFromDatabase();
        },
        error: err => console.error('Error saving order:', err)
      });
    } catch (err) {
      console.error('Stripe error:', err);
      this.cardErrors = 'An error occurred while processing your payment.';
    } finally {
      this.stripeLoading = false;
    }
  }

  calculateSubtotal(): number {
    return this.order.items.reduce((sum: number, item: { price: number; quantity: number; }) => sum + (item.price * item.quantity), 0);
  }

  calculateDiscount(): number {
    return this.order.items.reduce((sum: number, item: { price: number; quantity: number; discount: number; }) => {
      return sum + (item.price * item.quantity * (item.discount / 100));
    }, 0);
  }

  calculateTax(): number {
    return (this.calculateSubtotal() - this.calculateDiscount()) * (5 / 1000);
  }

  calculateTotal(): number {
    return (this.calculateSubtotal() - this.calculateDiscount()) +
      this.calculateTax() +
      this.shipping;
  }
  clearCartFromDatabase() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.cartService.clearCart(userId).subscribe({
        next: () => console.log('Cart cleared from database'),
        error: err => console.error('Error clearing cart from database:', err)
      });
    }
  }


  async processPayPalPayment(orderData: Icheckout) {
    this.paypalLoading = true;
    
    try {
      const successUrl = `${window.location.origin}/order-success`;
      const cancelUrl = `${window.location.origin}/checkout`;

      // Create PayPal order
      const paypalOrder = await this.paypalService.createOrder(
        this.calculateTotal(),
        successUrl,
        cancelUrl
      ).toPromise();

      // Redirect to PayPal
      if (paypalOrder && (paypalOrder as any).orderId) {
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${(paypalOrder as any).orderId}`;
        
        // Save the order in background
        this.checkoutService.checkout(orderData).subscribe({
          next: () => {
            localStorage.removeItem('order');
            this.clearCartFromDatabase();
          },
          error: err => console.error('Error saving order:', err)
        });
      }
    } catch (err) {
      console.error('PayPal error:', err);
      // Handle error (show message to user)
    } finally {
      this.paypalLoading = false;
    }
  }

}
