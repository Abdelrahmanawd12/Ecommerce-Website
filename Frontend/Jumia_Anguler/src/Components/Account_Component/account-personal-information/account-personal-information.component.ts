import { Component, OnInit } from '@angular/core';
import { AccountDetails, AddressBook } from '../../../Models/Account';
import { AccountService } from '../../../Services/Customer/Account.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { number } from 'echarts';

@Component({
  selector: 'app-account-personal-information',
  imports: [CommonModule,FormsModule],
  templateUrl: './account-personal-information.component.html',
  styleUrl: './account-personal-information.component.css'
})
// import { Component, OnInit } from '@angular/core';
// import { AccountService } from '../../Services/Customer/Account.service';
// import { AccountDetails } from '../../Models/Account';
// import { AddressBook } from '../../Models/Account';
// import { CommonModule } from '@angular/common'; // ✅ Needed for *ngIf and *ngFor
// import { FormsModule } from '@angular/forms';


// @Component({
//   standalone: true, // ✅ Add this
//   selector: 'app-account',
//   templateUrl: './account.component.html',
//   imports: [CommonModule,FormsModule],
// })
// export class AccountComponent implements OnInit {
//   accountDetails: AccountDetails | null = null;
//   //addressBook: AddressBook | null = null;
//   addressBook: AddressBook = {
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     street: '',
//     city: '',
//     country: ''
//   };

//   customerId = 'user1'; // replace with your test user ID

//   constructor(private accountService: AccountService) {}

//   ngOnInit(): void {
//     this.accountService.getAccountDetails(this.customerId).subscribe({
//       next: (data) => this.accountDetails = data,
//       error: (err) => console.error('Failed to load account details', err)
//     });
//     // this.accountService.getAddressBook(this.customerId).subscribe({
//     //   next: (data) => this.addressBook = data
//     //   // this.addressBook = data;
//     // });
//     this.accountService.getAddressBook(this.customerId).subscribe(data => {
//       this.addressBook = data;
//     });
//   }
//   updateAddressBook(): void {
//     console.log('Form submitted!'); // <-- just to confirm button is triggering
//     this.accountService.updateAddressBook(this.customerId, this.addressBook).subscribe({
//       next: () => {
//         console.log('Address Book updated successfully');
//         // Optional: show toast or refresh
//       },
//       error: (err) => {
//         console.error('Error updating Address Book', err);
//       }
//     });
//   }
  
// }
export class AccountPersonalInformationComponent implements OnInit {
  accountDetails: AccountDetails | null = null;

  addressBook: AddressBook = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    street: '',
    city: '',
    country: ''
  };

  updatedAddressBook: AddressBook = { ...this.addressBook };

  isEditing: boolean = false;

  customerId: string = localStorage.getItem('userId')?.trim() ?? '';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    console.log('Customer ID:', this.customerId); // ✅ Debug log

    this.accountService.getAccountDetails(this.customerId).subscribe({
      next: (data) => {
        console.log('Account Details loaded:', data);
        this.accountDetails = data;
      },
      error: (err) => console.error('Failed to load account details', err)
    });

    this.accountService.getAddressBook(this.customerId).subscribe({
      next: (data) => {
        console.log('Address book loaded:', data);
        this.addressBook = data;
        this.updatedAddressBook = { ...data };
      },
      error: (err) => {
        console.error('Error loading address book:', err); // ✅ Log actual error
        if (err.status === 404 && err.error === "No address found.") {
          console.warn('No address found for this user. Initializing empty address book.');
          this.addressBook = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            street: '',
            city: '',
            country: ''
          };
          this.updatedAddressBook = { ...this.addressBook };
        }
      }
    });    
  }

  openEditModal() {
    this.isEditing = true;
  }

  updateAddressBook(): void {
    this.accountService.updateAddressBook(this.customerId, this.updatedAddressBook).subscribe({
      next: () => {
        console.log('Address Book updated successfully');
        this.addressBook = { ...this.updatedAddressBook };

        if (this.accountDetails) {
          this.accountDetails.firstName = this.updatedAddressBook.firstName;
          this.accountDetails.lastName = this.updatedAddressBook.lastName;
        }

        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error updating Address Book', err);
      }
    });
  }

  isAddressValid(): boolean {
    const a = this.updatedAddressBook;
    return !!(a.firstName && a.lastName && a.phoneNumber && a.street && a.city && a.country);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.updatedAddressBook = { ...this.addressBook };
    }
  }
}