import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../Services/Customer/cart.service';
import { ProductService } from '../../Services/product.service';
import { FormsModule } from '@angular/forms';
import { SearchResponse } from '../../Models/search-response';
import { LoginService } from '../../Services/Auth/LoginServ/login.service';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  public totalItem: number = 0;
  get user(): string {
    return localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {
    this._CartService.getCart(this.user).subscribe(cart => {
      this._CartService.updateCartCount(cart.items.length);
    });
// cart counter
this._CartService.cartItemCount$.subscribe(count => {
  this.totalItem = count;
});



this.toggleAuth();


}

  dropdownOpen = false;
  helpDropdownOpen = false;
  searchQuery: string = '';
  searchResults: SearchResponse[] = [];
  showToast = false;


  constructor(private productService: ProductService, private router: Router,private auth:LoginService,private _CartService:CartService) { }

  navigateToHelp(section: string) {
    this.helpDropdownOpen = false;
    this.router.navigate(['/help'], { fragment: section });
  }

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




  onSearchChange() {
    if (this.searchQuery.trim() === '') {
      this.searchResults = [];
      return;
    }
    this.productService.Search(this.searchQuery).subscribe({
      next: (results) => {
        console.log('Results:', results); // Debug
        this.searchResults = results;
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.searchResults = [];
      },
    });
  }

  goToSearchResult(queryOrProduct: string | any) {
    if (typeof queryOrProduct === 'string') {
      this.router.navigate(['/search'], { queryParams: { q: queryOrProduct } });
    } else {
      this.router.navigate(['details/', queryOrProduct.productId]);   // awad change route from shop to details
    }
    this.searchResults = [];
  }
  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];

  }
  isLoggedIn: boolean = false;



  toggleAuth() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

  logout() {
      localStorage.clear();
      this.toggleAuth();
      this.router.navigate(['/home']);

      this.showToast = true;

      // Hide toast after 3 seconds
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
      window.location.reload();// updated by abdelrahman 
  }

  openLogoutModal() {
    const modalElement = document.getElementById('logoutModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

}
