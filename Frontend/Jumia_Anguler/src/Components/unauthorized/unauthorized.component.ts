import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent {

  readonly role = localStorage.getItem('role');
  constructor(
    private router: Router,
    private location: Location
  ) { }

  goBack(): void {
    if(this.role === 'Admin'){
      this.router.navigate(['/admin']);
    }else if(this.role === 'Seller'){
      this.router.navigate(['/sellerDashboard']);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']); // Adjust the route as needed
  }
}