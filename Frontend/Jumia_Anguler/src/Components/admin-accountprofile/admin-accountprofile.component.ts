import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminUserService, AdminDTO, UpdateAdminEmailDTO, ChangePasswordDTO } from '../../Services/useradmin.service';

@Component({
  standalone: true,
  selector: 'app-admin-accountprofile',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-accountprofile.component.html',
  styleUrl: './admin-accountprofile.component.css'
})
export class AdminAccountprofileComponent implements OnInit {
  admin: AdminDTO = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    gender: '',
    dateOfBirth: new Date()
  };

  password: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  } = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  editMode = {
    personal: false,
    contact: false
  };

  constructor(private adminService: AdminUserService) {}

  ngOnInit(): void {
    const adminId = localStorage.getItem('adminId'); 
    console.log('Admin ID from LocalStorage:', adminId);
    if (adminId) {
   
      this.loadAdminInfo(adminId);
    }
  }

  loadAdminInfo(id: string) {
    this.adminService.getAdminById(id).subscribe({
      next: (data) => {
        console.log('Loaded admin data:', data);
        this.admin = data;
      },
      error: (err) => {
        console.error('Error fetching admin info:', err);
      }
    });
  }

  editSection(section: 'personal' | 'contact') {
    this.editMode[section] = !this.editMode[section];
  }

  saveChanges() {
    if (!this.admin.id) return;

    this.adminService.editAdmin(this.admin.id, this.admin).subscribe({
      next: () => {
        alert('Admin info updated successfully');
        this.editMode.personal = false;
        this.editMode.contact = false;
      },
      error: (err) => {
        alert('Something went wrong while updating');
        console.error(err);
      }
    });
  }

  updateEmail() {
    if (!this.admin.id) return;

    const emailDto: UpdateAdminEmailDTO = {
      email: this.admin.email
    };

    this.adminService.updateAdminEmail(this.admin.id, emailDto).subscribe({
      next: () => {
        alert('Email updated successfully');
        this.editMode.contact = false;
      },
      error: (err) => {
        alert('Failed to update email');
        console.error(err);
      }
    });
  }

  openChangePasswordModal() {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('changePasswordModal'));
    modal.show();
  }

  changePassword() {
    if (this.password.newPassword !== this.password.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!this.admin.id) return;

    const dto: ChangePasswordDTO = {
      oldPassword: this.password.oldPassword,
      newPassword: this.password.newPassword
    };

    this.adminService.changePassword(this.admin.id, dto).subscribe({
      next: () => {
        alert('Password changed successfully');
        this.password = { oldPassword: '', newPassword: '', confirmPassword: '' };
        (window as any).bootstrap.Modal.getInstance(document.getElementById('changePasswordModal')).hide();
      },
      error: (err) => {
        alert('Password change failed');
        console.error(err);
      }
    });
  }

  openTwoFactorModal() {
    alert('Enable Two-Factor Authentication here');
  }

  openSecurityQuestionsModal() {
    alert('Set your security questions here');
  }
}