import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import * as bootstrap from 'bootstrap'; 

@Component({
  selector: 'app-account-sidebar',
  imports: [RouterLink,RouterModule],
  templateUrl: './account-sidebar.component.html',
  styleUrl: './account-sidebar.component.css'
})
export class AccountSidebarComponent {

  constructor(private router:Router){}

  confirmLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.logout();
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/home']);  
    const modal = document.getElementById('logoutModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.hide();
    }
  }
  
}
