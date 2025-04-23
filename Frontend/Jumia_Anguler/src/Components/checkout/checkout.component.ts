import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CheckoutService } from '../../Services/Customer/Checkout.service';
import { Address, AddressBook, CheckoutProduct } from '../../Models/Checkout';
import { environment } from '../../Environment/Environment.prod';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  imports: [CommonModule,FormsModule,],
  styleUrls: ['./checkout.component.css'] 
})

export class CheckoutComponent {
  address: Address = {  
    street: '',
    city: '',
    country: 'Egypt',
    userId: '' 
  };
  addressBook: AddressBook = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    street: '',
    city: '',
    country: ''
  };


  readonly imgbaseUrl=environment.imageBaseUrl;
  showAddAddressButton: boolean = true; 
  isEditing: boolean = false;
  //customerId = 'user1'; 
  customerId: string = localStorage.getItem('userId') ?? '';
  readonly imageBaseUrl = environment.imageBaseUrl;
  message = '';

 // 🟢 الكود الجديد هنا
 cartProducts: CheckoutProduct[] = [];
 grandTotal: number = 0;
 showForm: boolean = false;  // Flag to toggle address form display
 isLoading: boolean = false; // 🔄 عشان نمنع الضغط مرتين ونظهر لودينج


  constructor(private checkoutService: CheckoutService,   private router: Router) {}

  ngOnInit(): void {
    // 🟢 تحميل المنتجات الخاصة بالكارت
    this.checkoutService.getCartProducts(this.customerId).subscribe({
      next: (data) => {
        this.cartProducts = data.products;
        this.grandTotal = data.grandTotal;
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
    this.showAddAddressButton = false; // Hide the button after clicking
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
        }, 10); // small delay to make sure message shows or just feels smooth
      },
      error: (err) => {
        this.message = 'Error adding address';
        console.error(err);
      }
    });
  }

  confirmOrder() {
    // const confirmed = window.confirm('Are you sure to confirm order?');
    // if (!confirmed) {
    //   return; // المستخدم لغى، فبنخرج من الميثود
    // }
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

      // Navigate to the 'order' page after the order is confirmed
      this.router.navigate(['/order'], { state: { showThankYou: true } });
      },
      error: (err) => {
        this.message = 'Error confirming order';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
// Temp editable object
updatedAddressBook: AddressBook = { ...this.addressBook };

toggleEdit(): void {
  this.isEditing = !this.isEditing;
  this.updatedAddressBook = { ...this.addressBook };
}
updateAddressBook(): void {
  this.checkoutService.updateAddressBook(this.customerId, this.updatedAddressBook).subscribe({
    next: () => {
      this.addressBook = { ...this.updatedAddressBook };
      this.isEditing = false;
      this.showForm = false;
      // this.toggleEdit(); // غلق الفورم بعد التحديث
    },
    error: err => console.error('Update failed', err)
  });
}
  isAddressValid(): boolean {
    const a = this.addressBook;
    return a.firstName && a.lastName && a.phoneNumber && a.street && a.city && a.country ? true : false;
  }
}
