import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AdminDTO, UsersService } from '../../Services/users.service';
 import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edituser',
  imports: [FormsModule ,RouterLink ,ReactiveFormsModule,HttpClientModule ,RouterModule , CommonModule],
  templateUrl: './edituser.component.html',
  styleUrl: './edituser.component.css'
})

export class EditUserComponent implements OnInit {
  updateUserForm: FormGroup;
  userId!: string;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private router: Router
  ) {
    this.updateUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      gender: [''],
      dateOfBirth: ['']
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.loadUserData();
  }

  loadUserData(): void {
    this.usersService.getUserById(this.userId).subscribe({
      next: (user: AdminDTO) => {
        this.updateUserForm.patchValue(user);
      },
      error: () => this.errorMessage = 'Failed to load user data'
    });
  }

  onSubmit(): void {
    if (this.updateUserForm.valid) {
      const updatedUser: AdminDTO = { id: this.userId, ...this.updateUserForm.value };
      this.usersService.updateUser(updatedUser).subscribe({
        next: () => {
          this.successMessage = 'User updated successfully';
          setTimeout(() => this.router.navigate(['/admin/users']), 1500);
        },
        error: () => this.errorMessage = 'Update failed. Please try again.'
      });
    }
  }
}

    