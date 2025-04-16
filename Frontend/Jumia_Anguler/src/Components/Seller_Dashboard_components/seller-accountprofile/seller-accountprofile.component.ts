import { Component, OnInit } from '@angular/core';
import { SellerUserService } from '../../../Services/SellerServ/seller-user.service';
import { Seller } from '../../../Models/seller';
import { DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-seller-accountprofile',
  imports: [JsonPipe,DatePipe],
  templateUrl: './seller-accountprofile.component.html',
  styleUrl: './seller-accountprofile.component.css'
})
export class SellerAccountprofileComponent implements OnInit{

  constructor(private sellerServ: SellerUserService) { }
  ngOnInit(): void {
    this.getUser();
  }
  private id: string = localStorage.getItem('userId') || '';
  userData: Seller |undefined;

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

    const names = fullName.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }
}
