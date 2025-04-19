import { Component, OnInit } from '@angular/core';

import { AdminUserService, UpdatePasswordDTO , AdminDTO } from '../../Services/useradmin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-accountprofile',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-accountprofile.component.html',
  styleUrl: './admin-accountprofile.component.css'
})
export class AdminAccountprofileComponent  implements OnInit {

    admin: AdminDTO = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      dateOfBirth: new Date(),
      createdAt: new Date(),
      gender: ''
    };
  
    editMode = {
      personal: false,
      contact: false
    };
  
    password: UpdatePasswordDTO & { confirmPassword: string } = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  
    constructor(private adminService: AdminUserService) {}
  
    ngOnInit(): void {
      const adminId = localStorage.getItem('adminId'); 
      if (adminId) {
        this.loadAdminInfo(adminId);
      }
    }
  
    loadAdminInfo(id: string) {
      this.adminService.getAdminInfo(id).subscribe({
        next: (data) => {
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
  
      const dto: UpdatePasswordDTO = {
        oldPassword: this.password.oldPassword,
        newPassword: this.password.newPassword
      };
  
      this.adminService.updatePassword(this.admin.id, dto).subscribe({
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
  