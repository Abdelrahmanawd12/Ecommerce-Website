import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';



import { Component } from '@angular/core';
import { CheckoutService } from '../../Services/Customer/Checkout.service';
import { Address, AddressBook, CheckoutProduct } from '../../Models/Checkout';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  imports: [
    CommonModule,   // Required for *ngIf, *ngFor, etc.
    FormsModule,    // Required for template-driven forms [(ngModel)]
    // NgModule,
  ],
  styleUrls: ['./checkout.component.css'] // ✅ Import style here
})
export class CheckoutComponent {
  address: Address = {
    
    street: '',
    city: '',
    country: '',
    userId: '' // هنحطها من الكود مش من الفورم
  };
  addressBook: AddressBook = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    street: '',
    city: '',
    country: ''
  };
  

  //customerId = 'user4'; // اختبار بس، لحد ما نعمل Login بعدين
  customerId: string = localStorage.getItem('userId') ?? '';

  message = '';

 // 🟢 الكود الجديد هنا
 cartProducts: CheckoutProduct[] = [];
 grandTotal: number = 0;
 showForm: boolean = false;  // Flag to toggle address form display



 isLoading: boolean = false; // 🔄 عشان نمنع الضغط مرتين ونظهر لودينج

//  paymentMethod: string = 'visa';
// paymentMessage: string = '';
// paymentSuccess: boolean = false;


  constructor(private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    // 🟢 تحميل المنتجات الخاصة بالكارت
    this.checkoutService.getCartProducts(this.customerId).subscribe({
      next: (data) => {
        this.cartProducts = data.products;
        this.grandTotal = data.grandTotal;
        // this.cartProducts = data.Products;       // ✅ Capital P
        // this.grandTotal = data.TotalCartPrice;   // ✅ Capital T, C, P
        console.log('Total:', this.grandTotal);  // 🟢 اطبعها للتأكد
      },
      error: (err) => {
        console.error('Error fetching cart products', err);
      }
    });


    this.checkoutService.getAddressBook(this.customerId).subscribe(data => {
      this.addressBook = data;
    });
  }


  // Method to show the form when clicking "Add Address"
  addAddress(): void {
    this.showForm = true; // Show the form when button is clicked
  }

  
  onSubmit() {
    this.address.userId = this.customerId; // 🟢 أهي النقطة اللي تهمنا

    this.checkoutService.addAddress(this.address).subscribe({
      next: (res) => {
        this.message = 'Address added successfully!';
        console.log(res);



        setTimeout(() => {
          location.reload();
        }, 100); // small delay to make sure message shows or just feels smooth
      },



      error: (err) => {
        this.message = 'Error adding address';
        console.error(err);
      }
    });
    

    
  }

  // confirmOrder() {
  //   this.isLoading = true;

    

  //   const orderPayload = {
  //     customerId: this.customerId,
  //     shippingAddress: `${this.address.street}, ${this.address.city}, ${this.address.country}`
  //   };
  //   this.checkoutService.confirmOrder(orderPayload).subscribe({
  //     next: (res: any) => {
  //       this.message = res.message || 'Order confirmed!';
  //       this.cartProducts = [];
  //       this.grandTotal = 0;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       this.message = 'Error confirming order';
  //       console.error(err);
  //       this.isLoading = false;
  //     }
  //   });
  // }
  confirmOrder() {
    this.isLoading = true;
  
    // Choose the address source: form or saved address book
    const usedAddress = this.showForm ? this.address : {
      street: this.addressBook.street,
      city: this.addressBook.city,
      country: this.addressBook.country
    };
  
    const orderPayload = {
      customerId: this.customerId,
      shippingAddress: `${usedAddress.street}, ${usedAddress.city}, ${usedAddress.country}`
    };
  
    this.checkoutService.confirmOrder(orderPayload).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Order confirmed!';
        this.cartProducts = [];
        this.grandTotal = 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.message = 'Error confirming order';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  


  isAddressValid(): boolean {
    const a = this.addressBook;
    return a.firstName && a.lastName && a.phoneNumber && a.street && a.city && a.country ? true : false;
  }




  
  













   // ✅ دالة تنفيذ الدفع
  //  processPayment() {
  //   if (this.paymentMethod === 'visa') {
  //     this.paymentMessage = 'Payment processed successfully with Visa!';
  //     this.paymentSuccess = true;
  //   } else if (this.paymentMethod === 'cod') {
  //     this.paymentMessage = 'Order placed. You will pay Cash on Delivery.';
  //     this.paymentSuccess = true;
  //   } else if (this.paymentMethod === 'vodafone') {
  //     this.paymentMessage = 'Please send payment to Vodafone Cash number: 010XXXXXXX';
  //     this.paymentSuccess = true;
  //   } else {
  //     this.paymentMessage = 'Invalid payment method selected.';
  //     this.paymentSuccess = false;
  //   }
  // }
  //أو دي
  // selectedPaymentMethod: string = 'visa';  // Default is 'visa'
  // visaCardNumber: string = '';
  // isValidVisaCard: boolean = true;  // Initially set to true so button is enabled (if valid)

  // // Function to validate Visa card number
  // validateVisaCardNumber() {
  //   // Visa card is usually 16 digits and starts with 4 (if it's Visa)
  //   const visaPattern = /^4\d{15}$/;  // A Visa card number starts with 4 and is 16 digits long
  //   this.isValidVisaCard = visaPattern.test(this.visaCardNumber);
  // }

  // // Simulate the "Pay Now" action
  // payNow() {
  //   console.log("Payment Processed for card: ", this.visaCardNumber);
  //   alert('Payment processed successfully!');
  // }
}
