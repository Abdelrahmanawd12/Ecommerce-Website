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
import { IAddress } from '../../Models/iaddress';
import { PaypalService } from '../../Services/paypal.service';


@Component({
  selector: 'app-checkout',
  imports: [DatePipe, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  paymentMethod: string = '';
  stripe: any;
  card: any;
  elements: any;
  stripeLoading: boolean = false;
  paypalLoading: boolean = false;
  cardErrors: string | null = null;
  shipping: number = 65;
  readonly imgBase = environment.imageBaseUrl;

  selectedAddress: any;
  userId = localStorage.getItem('userId') || '';
  isBillingDifferent: boolean = false;

  addresses: IAddress[] = [];

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private paypalService: PaypalService,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private addressService: AddressService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      shipping: this.fb.group({
        receiverName: ['', Validators.required],
        recieverEmail: ['', [Validators.required, Validators.email]],
        receiverPhone: ['', Validators.required],
        street: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        shippingMethod: ['standard', Validators.required],
        deliveryDate: ['']
      }),
      paymentMethod: ['cod', Validators.required],
    });
    console.log(this.paymentMethod)

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
        street: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        shippingMethod: ['standard'],
        deliveryDate: [this.getDeliveryDate('standard')],
      }),
      paymentMethod: ['cod', Validators.required]
    });

    this.addressService.getAddresses(this.userId).subscribe({
      next: (addresses) => {
        this.addresses = addresses;

        if (this.addresses.length > 0) {
          const firstAddress = this.addresses[0];
          this.selectedAddress = firstAddress.addressId ? firstAddress.addressId.toString() : null;

          this.checkoutForm.get('shipping.street')?.setValue(firstAddress.street);
          this.checkoutForm.get('shipping.city')?.setValue(firstAddress.city);
          this.checkoutForm.get('shipping.country')?.setValue(firstAddress.country);
        }
      },
      error: (err) => console.error('Error fetching address:', err),
    });
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      console.log('Payment method changed to:', method);
      this.paymentMethod = method;
      if (method === 'stripe') {
        this.initializeStripe();
      }
    });

    this.checkoutForm.get('shipping.shippingMethod')?.valueChanges.subscribe(method => {
      const newDate = this.getDeliveryDate(method);
      this.checkoutForm.get('shipping.deliveryDate')?.setValue(newDate);
      this.shipping = this.getShippingCost(method);
    });

  }

  async initializeStripe() {
    this.stripe = await loadStripe(environment.stripePublishableKey);
    if (this.stripe) {
      this.setupStripeElements();
    }
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

    try {
      const orderData = await this.prepareOrderData();
      const selectedPaymentMethod = this.checkoutForm.get('paymentMethod')?.value;

        if (selectedPaymentMethod === 'cod') {
          this.processCashOnDelivery(orderData);
        } else if (selectedPaymentMethod === 'stripe') {
          await this.processStripePayment(orderData);
        }
        else if (selectedPaymentMethod === 'paypal') {
          await this.processPayPalPayment(orderData);
        } else {
          console.error('Unsupported payment method:', selectedPaymentMethod);
        }

      // switch (this.paymentMethod) {
      //   case 'cod':
      //     this.processCashOnDelivery(orderData);
      //     break;
      //   case 'stripe':
      //     await this.processStripePayment(orderData);
      //     break;
      //   case 'paypal':
      //     await this.processPayPalPayment(orderData);
      //     break;
      // }
      // if (this.paymentMethod === 'cod') {
      //   this.processCashOnDelivery(orderData);
      // } else if (this.paymentMethod === 'stripe') {
      //   await this.processStripePayment(orderData);
      // }
    }catch(error: any) {
      console.error('Checkout error:', error);
      this.cardErrors = 'An error occurred during checkout';
    }
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

    const shippingAddress = `${formValue.shipping.street}, ${formValue.shipping.city}, ${formValue.shipping.country}`;

    return {
      customerId,
      sellerId,
      paymentMethod: formValue.paymentMethod,
      shippingAddress,
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
        shippingAddress,
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

  getShippingCost(method: string): number {
    switch (method) {
      case 'express':
        return 120;
      case 'overnight':
        return 200;
      default:
        return 65;
    }
  }

  processCashOnDelivery(orderData: Icheckout) {
    this.checkoutService.checkout(orderData).subscribe({
      next: () => {
        this.router.navigate(['/order-success']),
          localStorage.removeItem('order');
        this.clearCartFromDatabase();
        this.UpdateStock(orderData.items);

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
          this.UpdateStock(orderData.items);
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


  selectedAddressId: string | null = null;
  onAddressSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const addressId = selectElement.value;

    console.log("Address ID selected:", addressId);

    if (addressId) {
      const selectedAddress = this.addresses.find(addr => addr.addressId?.toString() === addressId);
      console.log("Selected Address:", selectedAddress);

      if (selectedAddress) {
        const shippingGroup = this.checkoutForm.get('shipping');
        if (shippingGroup) {
          shippingGroup.patchValue({
            street: selectedAddress.street,
            city: selectedAddress.city,
            country: selectedAddress.country
          });
          console.log("Updated shipping form:", shippingGroup.value);
        }
      }
    }
  }



  saveAddress() {
    const shipping = this.checkoutForm.get('shipping')?.value;
    const address: IAddress = {
      street: shipping.street,
      city: shipping.city,
      country: shipping.country,
      userId: this.userId
    };
    this.addressService.getAddresses(this.userId).subscribe({
      next: addresses => {
        if (addresses && addresses.length > 0) {
          const addressExists = addresses.some(existingAddress =>
            existingAddress.street === address.street &&
            existingAddress.city === address.city &&
            existingAddress.country === address.country
          );

          if (addressExists) {
            this.showToast('This address already exists.', 'danger');
          } else {
            this.addressService.addAddress(this.userId, address).subscribe({
              next: () => {
                console.log(address);
                this.showToast('Address saved successfully!', 'success');
              },
              error: () => {
                console.log(address);
                this.showToast('Failed to save address.', 'danger');
              }
            });
          }
        } else {
          this.addressService.addAddress(this.userId, address).subscribe({
            next: () => {
              console.log(address);
              this.showToast('Address saved successfully!', 'success');
            },
            error: () => {
              console.log(address);
              this.showToast('Failed to save address.', 'danger');
            }
          });
        }
      },
      error: err => {
        console.error('Error fetching addresses:', err);
        this.addressService.addAddress(this.userId, address).subscribe({
          next: () => {
            console.log(address);
            this.showToast('Address saved successfully!', 'success');
          },
          error: () => {
            console.log(address);
            this.showToast('Failed to save address.', 'danger');
          }
        });
      }
    });
  }



  showToast(message: string, type: 'success' | 'danger') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0 show`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    toastContainer?.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
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
            this.UpdateStock(orderData.items);
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

 UpdateStock(orderItems: any) {
    this.checkoutService.updateStock(orderItems).subscribe({
      next: () => {
        console.log('Stock updated successfully');
      },
      error: (error) => {
        console.error('Failed to update stock:', error);
      }
    });
  }
  
}
