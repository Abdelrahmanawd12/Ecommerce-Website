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
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../Services/Customer/Account.service';
import { AccountDetails, AddressBook } from '../../Models/Account';
import { CommonModule } from '@angular/common'; // ✅ Needed for *ngIf and *ngFor
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  standalone: true, // ✅ Add this if you're using `imports` array
  imports: [CommonModule, FormsModule],
})
export class AccountComponent implements OnInit {
  accountDetails: AccountDetails | null = null;
  addressBook: AddressBook = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    street: '',
    city: '',
    country: ''
  };

  // Temporary variable to hold form values
  updatedAddressBook: AddressBook = { ...this.addressBook };

  // Toggle for form visibility
  isEditing: boolean = false;
  

  readonly customerId = localStorage.getItem('userId') || '';
  // customerId = 'user1'; // Replace with your test user ID

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getAccountDetails(this.customerId).subscribe({
      next: (data) => this.accountDetails = data,
      error: (err) => console.error('Failed to load account details', err)
    });

    this.accountService.getAddressBook(this.customerId).subscribe(data => {
      this.addressBook = data;
      // Create a copy of the addressBook to be used in the form
      this.updatedAddressBook = { ...data };
    });
  }

  updateAddressBook(): void {
    // Only update addressBook when button is clicked
    this.accountService.updateAddressBook(this.customerId, this.updatedAddressBook).subscribe({
      next: () => {
        console.log('Address Book updated successfully');
        this.addressBook = { ...this.updatedAddressBook };

        // ✅ Update Account Details if name changed
        if (this.accountDetails) {
          this.accountDetails.firstName = this.updatedAddressBook.firstName;
          this.accountDetails.lastName = this.updatedAddressBook.lastName;
        }
        this.isEditing = false;
        // Optionally, update the addressBook with the latest data from updatedAddressBook
        // this.addressBook = { ...this.updatedAddressBook };
        // this.isEditing = false; // Hide the form after update
      },
      error: (err) => {
        console.error('Error updating Address Book', err);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing; // Toggle the visibility of the form
  }
}
