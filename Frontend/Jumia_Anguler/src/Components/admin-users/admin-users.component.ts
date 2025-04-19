import { Component, OnInit } from '@angular/core';
import { AdminDTO, UsersService } from '../../Services/users.service';
;
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  imports: [  
    CommonModule,RouterLink],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit  {
 

 
    users: AdminDTO[] = [];
  
    constructor(private usersservice: UsersService) {}
  
    ngOnInit(): void {
      this.loadUsers();
    }
  
    loadUsers() {
      this.usersservice.getAllUsers().subscribe(data => {
        this.users = data;
      });
    }
  
    deleteUser(id: string) {
      this.usersservice.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== id);
      });
    }
  }
  

