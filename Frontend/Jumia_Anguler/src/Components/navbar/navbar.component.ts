import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../Services/Customer/cart.service';

@Component({
  selector: 'app-navbar',
  imports:[CommonModule ,RouterLink,RouterLinkActive] ,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  public totalItem: number = 0;
  constructor(private _CartService:CartService) { }
  get user(): string {
    return localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {
// cart counter
this._CartService.cartItemCount$.subscribe(count => {
  this.totalItem = count;
});

this._CartService.getCart(this.user).subscribe(cart => {
  this._CartService.updateCartCount(cart.items.length);
});  }

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
