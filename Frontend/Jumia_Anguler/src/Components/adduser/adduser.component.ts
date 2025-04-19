
  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
  import { AdminDTO, UsersService } from '../../Services/users.service';
  import { Router, RouterLink, RouterModule } from '@angular/router';
  import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adduser',
  imports: [FormsModule ,RouterLink ,ReactiveFormsModule,HttpClientModule ,RouterModule , CommonModule],
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css'
})
export class AdduserComponent implements OnInit {
  
  addUserForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) {
    this.addUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      gender: [''],
      dateOfBirth: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.addUserForm.valid) {
      const user: AdminDTO = this.addUserForm.value;

      this.usersService.addUser(user).subscribe({
        next: (response) => {
          this.successMessage = 'User added successfully!';
          this.addUserForm.reset(); 
          setTimeout(() => {
            this.router.navigate(['/users']); 
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to add user!';
          console.error(err);
        }
      });
    } else {
      console.warn("Form is invalid. Please check your inputs.");
    }
  }
}
