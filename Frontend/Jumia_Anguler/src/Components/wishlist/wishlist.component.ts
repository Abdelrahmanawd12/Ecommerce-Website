import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../Services/Customer/Wishlist.service';
import { WishlistItem } from '../../Models/Wishlist';
import { CommonModule } from '@angular/common'; // ✅ Needed for *ngIf and *ngFor
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  standalone: true, // ✅ Add this if you're using `imports` array
  imports: [CommonModule,FormsModule],
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  //customerId: string = 'user1'; // Replace with the actual customer ID or dynamically get it
  customerId: string = localStorage.getItem('userId') ?? '';
  

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist(): void {
    this.wishlistService.getWishlist(this.customerId).subscribe({
      next: (data) => {
        this.wishlistItems = data;
      },
      error: (err) => {
        console.error('Error fetching wishlist items', err);
      }
    });
  }

  deleteItem(wishlistItemId: number): void {
    const confirmed = confirm("Are you sure you want to remove this item from your wishlist?");
    if (!confirmed) return;
  
    this.wishlistService.deleteWishlistItem(wishlistItemId).subscribe({
      next: () => {
        // Remove the item from the local list
        this.wishlistItems = this.wishlistItems.filter(item => item.wishlistItemId !== wishlistItemId);
      },
      error: (err) => {
        console.error('Error deleting item:', err);
        alert('Failed to remove item from wishlist. Please try again.');
      }
    });
  }
  

  addToCart(wishlistItemId: number): void {
    const confirmAdd = confirm('Are you sure you want to add this item to the cart?');
  
    if (!confirmAdd) {
      return; // User canceled
    }
  
    this.wishlistService.addToCart(wishlistItemId).subscribe({
      next: () => {
        //alert('Item added to cart successfully!');
        this.wishlistItems = this.wishlistItems.filter(item => item.wishlistItemId !== wishlistItemId);
      },
      error: (err) => {
        console.error('Error adding item to cart:', err);
        alert('Failed to add item to cart. Please try again.');
      }
    });
  }
  
  
  
}
