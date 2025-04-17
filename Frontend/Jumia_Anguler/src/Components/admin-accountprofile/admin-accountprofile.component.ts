import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-accountprofile',
  imports: [],
  templateUrl: './admin-accountprofile.component.html',
  styleUrl: './admin-accountprofile.component.css'
})
export class AdminAccountprofileComponent {

  admin = {
    name: 'Alaa Hafez',
    role: 'System Administrator'
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


