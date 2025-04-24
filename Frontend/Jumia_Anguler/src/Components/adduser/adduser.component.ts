import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminDTO, Roles, UsersService } from '../../Services/users.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateUserDTO } from '../../Services/users.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatError } from '@angular/material/form-field';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-adduser',
  standalone: true,
  imports: [FormsModule, RouterLink, ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
  
    MatError,
    HttpClientModule, RouterModule, CommonModule],
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css'
})
export class AdduserComponent implements OnInit {
    userForm!: FormGroup;
    isLoading = false;
    hidePassword = true;
    hideConfirmPassword = true;
    roles = Object.values(Roles);
    minDate: Date;
    maxDate: Date;
    emailError: string = '';
    emailServerError: string = '';
    constructor(
      private fb: FormBuilder,
      private adminService: UsersService,
      public router: Router
    ) {
      // Set date limits (18 years old minimum, 100 years max)
      const currentYear = new Date().getFullYear();
      this.minDate = new Date(currentYear - 100, 0, 1);
      this.maxDate = new Date(currentYear - 18, 11, 31);
    }
  
    ngOnInit(): void {
      this.initForm();
    }
  
    initForm(): void {
      this.userForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required],
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        ]],
        confirmPassword: ['', Validators.required],
        storeName: [''],
        storeAddress: ['']
      }, { validator: this.checkPasswords });
  
  
      const roleControl = this.userForm.get('role');
      if (roleControl) {
        roleControl.valueChanges.subscribe(role => {
          const storeNameControl = this.userForm.get('storeName');
          const storeAddressControl = this.userForm.get('storeAddress');
          
          if (role === Roles.Seller) {
            storeNameControl?.setValidators([Validators.required]);
            storeAddressControl?.setValidators([Validators.required]);
          } else {
            storeNameControl?.clearValidators();
            storeAddressControl?.clearValidators();
          }
          storeNameControl?.updateValueAndValidity();
          storeAddressControl?.updateValueAndValidity();
        });
      }
    }
  
    checkPasswords(group: FormGroup) {
      const passwordControl = group.get('password');
      const confirmPasswordControl = group.get('confirmPassword');
      
      const password = passwordControl?.value;
      const confirmPassword = confirmPasswordControl?.value;
      
      return password === confirmPassword ? null : { notSame: true };
    }
  
 
    onSubmit(): void {
      if (this.userForm.invalid) {
        this.userForm.markAllAsTouched();
        return;
      }
  
      this.isLoading = true;
      this.emailServerError = '';
    
      
      const dateString = this.userForm.get('dateOfBirth')?.value;
      const isoDate = dateString ? `${dateString}T00:00:00Z` : undefined;
  
      const userData: CreateUserDTO = {
        ...this.userForm.value,
        dateOfBirth: isoDate
      };
  
      this.adminService.addUser(userData).subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 500) { 
            this.emailServerError = 'This email is already Taken.';
            this.userForm.get('email')?.setErrors({ serverError: true });
          } else {
            console.error('Error creating user:', err);
          }
        }
      });
    }
  
     
    
    
    get showStoreFields(): boolean {
      return this.userForm.get('role')?.value === Roles.Seller;
    }
  }         
