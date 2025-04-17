import { Component, OnInit } from '@angular/core';
import { SellerUserService } from '../../../Services/SellerServ/seller-user.service';
import { Seller } from '../../../Models/seller';
import { CommonModule, DatePipe, JsonPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import bootstrap from 'bootstrap';
declare var bootstrap: any;

@Component({
  selector: 'app-seller-accountprofile',
  imports: [JsonPipe, DatePipe, FormsModule, NgIf,CommonModule],
  templateUrl: './seller-accountprofile.component.html',
  styleUrl: './seller-accountprofile.component.css'
})
export class SellerAccountprofileComponent implements OnInit {

  constructor(private sellerServ: SellerUserService) { }
  ngOnInit(): void {
    this.getUser();
  }
  private id: string = localStorage.getItem('userId') || '';
  userData: Seller = {
    firstName: '',
    lastName: '',
    email: '',
    storeName: '',
    storeAddress: '',
    shippingZone: '',
    createdAt: new Date(),
    gender: '',
    phone: '',
    dob: new Date(),
  };
  getUser(): void {
    this.sellerServ.getSellerInfo(this.id).subscribe({
      next: (res) => {
        this.userData = res;
        console.log('User Data:', this.userData);
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';
  
    const names = fullName.trim().split(/\s+/); 
    let initials = names[0].substring(0, 1).toUpperCase();
  
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
  
    return initials;
  }
  // Add this property to your component
  isEditMode: boolean = false;

  // Add this method to toggle edit mode
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;

    if (!this.isEditMode) {
      console.log('Updated Seller:', this.userData);
      this.saveChanges();
    }
  }


  saveChanges() {
    if (!this.id) {
      console.error('No user ID found in localStorage.');
      return;
    }

    this.sellerServ.editSeller(this.id, this.userData).subscribe({
      next: (res) => {
        console.log('Seller info updated successfully:', res);
        this.userData = res;
      },
      error: (err) => {
        console.error('Error updating seller info:', err);
      }
    });
  }

  oldPassword: string = '';
  newPassword: string = '';
  message: string = '';

  onChangePassword() {
    if (this.oldPassword && this.newPassword) {
      this.sellerServ.updatePassword(this.id, this.oldPassword, this.newPassword)
        .subscribe({
          next: (response) => {
            this.message = response.message;
            this.showToast();

            // اقفلي المودال
            const modalEl = document.getElementById('changePasswordModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            // Reset fields
            this.oldPassword = '';
            this.newPassword = '';
          },
          error: (error) => {
            if (error.error && error.error.errors) {
              this.message = error.error.errors.join(', ');
            } else if (typeof error.error?.message === 'string') {
              this.message = error.error.message;
            } else {
              this.message = 'An unknown error occurred.';
            }
            this.showToast(true); // error
          }
        });
    } else {
      this.message = 'Please provide both old and new passwords';
      this.showToast(true);
    }
  }

  showToast(isError: boolean = false) {
    const toastEl = document.getElementById('passwordToast');
    if (toastEl) {
      if (isError) {
        toastEl.classList.remove('text-bg-success');
        toastEl.classList.add('text-bg-danger');
      } else {
        toastEl.classList.remove('text-bg-danger');
        toastEl.classList.add('text-bg-success');
      }
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }
  oldPasswordType: string = 'password';
  newPasswordType: string = 'password';
  toggleOldPasswordVisibility() {
    this.oldPasswordType = this.oldPasswordType === 'password' ? 'text' : 'password';
  }

  toggleNewPasswordVisibility() {
    this.newPasswordType = this.newPasswordType === 'password' ? 'text' : 'password';
  }

//   readonly colors: string[] = ['#FF5733', '#33FF57', '#3357FF', '#F4A300', '#8E44AD', '#1ABC9C', '#FF1493'];

// getRandomColor(): string {
//   const randomIndex = Math.floor(Math.random() * this.colors.length);  
//   return this.colors[randomIndex];
// }

// onLogin() {
//   const randomColor = this.getRandomColor();
//   document.querySelector('.profile-initials')?.setAttribute('style', `background-color: ${randomColor}`);
// }
}
