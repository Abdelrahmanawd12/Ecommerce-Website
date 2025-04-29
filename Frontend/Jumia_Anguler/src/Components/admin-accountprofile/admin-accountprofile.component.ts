import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminUserService, AdminDTO, ChangePasswordDTO } from '../../Services/useradmin.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-admin-accountprofile',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-accountprofile.component.html',
  styleUrls: ['./admin-accountprofile.component.css']
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

  password: ChangePasswordDTO = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  editMode = {
    personal: false,
    contact: false
  };

  loadingStates = {
    profile: false,
    password: false
  };

  constructor(private adminService: AdminUserService) {}

  ngOnInit(): void {
    this.loadAdminData();
  }

  private loadAdminData(): void {
    const adminId = localStorage.getItem('userId');
    if (!adminId) {
      this.showAlert('Admin ID not found', 'error');
      return;
    }

    this.loadingStates.profile = true;
    this.adminService.getAdminById(adminId).subscribe({
      next: (data) => {
        this.admin = data;
        this.loadingStates.profile = false;
      },
      error: (err) => {
        console.error('Error loading admin data:', err);
        this.showAlert('Failed to load admin data', 'error');
        this.loadingStates.profile = false;
      }
    });
  }

  toggleEditMode(section: 'personal' | 'contact'): void {
    this.editMode[section] = !this.editMode[section];
  }
  editSection(section: 'personal' | 'contact'): void {
    this.editMode[section] = !this.editMode[section];
  }
  saveChanges(): void {
    if (!this.validateAdminData()) return;

    this.loadingStates.profile = true;
    this.adminService.editAdmin(this.admin.id!, this.admin).subscribe({
      next: (updatedAdmin) => {
        this.admin = updatedAdmin;
        this.editMode = { personal: false, contact: false };
        this.showAlert('Profile updated successfully!', 'success');
        this.loadingStates.profile = false;
      },
      error: (err) => {
        this.handleSaveError(err);
        this.loadingStates.profile = false;
      }
    });
  }

  private validateAdminData(): boolean {
    if (!this.admin.id) {
      this.showAlert('No admin ID available', 'error');
      return false;
    }

    if (!this.admin.firstName?.trim() || !this.admin.lastName?.trim() || !this.admin.email?.trim()) {
      this.showAlert('Please fill all required fields', 'error');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.admin.email)) {
      this.showAlert('Please enter a valid email address', 'error');
      return false;
    }

    return true;
  }

  changePassword(): void {
    if (!this.validatePassword()) return;

    this.loadingStates.password = true;
    this.adminService.changePassword(this.admin.id!, this.password).subscribe({
      next: () => {
        this.showAlert('Password changed successfully!', 'success');
        this.resetPasswordForm();
        this.loadingStates.password = false;
      },
      error: (err) => {
        this.handlePasswordError(err);
        this.loadingStates.password = false;
      }
    });
  }

  private validatePassword(): boolean {
    if (this.password.newPassword !== this.password.confirmPassword) {
      this.showAlert('New password and confirmation do not match', 'error');
      return false;
    }

    if (!this.admin.id) {
      this.showAlert('No admin ID available', 'error');
      return false;
    }

    if (this.password.newPassword.length < 8) {
      this.showAlert('Password must be at least 8 characters long', 'error');
      return false;
    }

    return true;
  }

  private resetPasswordForm(): void {
    this.password = { oldPassword: '', newPassword: '', confirmPassword: '' };
    this.closeModal('changePasswordModal');
  }

  private closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      (window as any).bootstrap.Modal.getInstance(modal)?.hide();
    }
  }

  private handleSaveError(err: any): void {
    console.error('Update error:', err);
    let errorMessage = 'Failed to update profile';

    if (err.status === 404) {
      errorMessage = 'Admin not found';
    } else if (err.status === 400) {
      errorMessage = 'Invalid data: ' + (err.error?.message || '');
    } else if (err.status === 401) {
      errorMessage = 'Unauthorized access';
    } else if (err.status === 0) {
      errorMessage = 'Cannot connect to server. Please check your connection.';
    }

    this.showAlert(errorMessage, 'error');
  }

  private handlePasswordError(err: any): void {
    console.error('Password change error:', err);
    let errorMessage = 'Failed to change password';

    if (err.status === 400) {
      errorMessage = 'Invalid request: ' + (err.error?.title || '');
    } else if (err.status === 401) {
      errorMessage = 'Current password is incorrect';
    } else if (err.status === 0) {
      errorMessage = 'Cannot connect to server';
    }

   }
   
   showAlert(message: string, type: 'success' | 'error' | 'info'): void {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
  
      Toast.fire({
        icon: type,
        title: message,
        background: '#f8f9fa',
        color: this.getColorForType(type),
        iconColor: this.getIconColorForType(type)
      });
    }
  
    private getColorForType(type: string): string {
      const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8'
      };
      return colors[type as keyof typeof colors] || '#6c757d';
    }
  
    private getIconColorForType(type: string): string {
      const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8'
      };
      return colors[type as keyof typeof colors] || '#6c757d';
    }
  
   
  
  openChangePasswordModal(): void {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
      new (window as any).bootstrap.Modal(modal).show();
    }
  }

  openTwoFactorModal(): void {
    this.showAlert('Two-Factor Authentication feature coming soon!' , 'info');
  }

  openSecurityQuestionsModal(): void {
  this. showAlert('Security Questions feature coming soon!' , 'info');
  }

}