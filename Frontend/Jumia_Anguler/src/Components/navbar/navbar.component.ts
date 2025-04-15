import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports:[CommonModule ,RouterLink,RouterLinkActive] ,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  dropdownOpen = false;
  helpDropdownOpen = false;
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  
  toggleHelpDropdown() {
    this.helpDropdownOpen = !this.helpDropdownOpen; 
  }
   
  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.help-dropdown')) {
      this.helpDropdownOpen = false;
    }
}
}