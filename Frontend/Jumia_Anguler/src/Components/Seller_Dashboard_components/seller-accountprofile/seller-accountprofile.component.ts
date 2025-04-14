import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-accountprofile',
  imports: [],
  templateUrl: './seller-accountprofile.component.html',
  styleUrl: './seller-accountprofile.component.css'
})
export class SellerAccountprofileComponent {
user = {
  name: 'Rania Rabea',
  shopName: 'Premium Electronics Store'
};

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
