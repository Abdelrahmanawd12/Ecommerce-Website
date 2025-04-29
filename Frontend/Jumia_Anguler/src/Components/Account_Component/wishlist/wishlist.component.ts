import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Needed for *ngIf and *ngFor
import { FormsModule } from '@angular/forms';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
declare var bootstrap: any;
import { WishlistItem } from '../../../Models/Wishlist';
import { WishlistService } from '../../../Services/Customer/Wishlist.service';
import { environment } from '../../../Environment/Environment.prod';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  standalone: true, // ✅ Add this if you're using imports array
  imports: [CommonModule,FormsModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger('80ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  //customerId: string = 'user1'; // Replace with the actual customer ID or dynamically get it
  customerId: string = localStorage.getItem('userId') ?? '';
  @ViewChild('toastElement', { static: false }) toastElement!: ElementRef;
  wishlistItemIdToDelete: number =0;
  readonly imgBase = environment.imageBaseUrl;

  showToast: boolean = false;
  toastMessage: string = '';

  constructor(private wishlistService: WishlistService, private router: Router) {}

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
    this.wishlistItemIdToDelete = wishlistItemId;
  
    const modalElement = document.getElementById('confirmModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  
  confirmDelete(): void {
    console.log('Deleting item:', this.wishlistItemIdToDelete);
    this.wishlistService.deleteWishlistItem(this.wishlistItemIdToDelete).subscribe({
      next: () => {
        console.log('Item deleted successfully');
        this.wishlistItems = this.wishlistItems.filter(item => item.wishlistItemId !== this.wishlistItemIdToDelete);
        
        this.toastMessage = 'Item removed from wishlist!';
        
        const toast = new bootstrap.Toast(this.toastElement.nativeElement);
        toast.show();
        
        setTimeout(() => this.showToast = false, 3000);
      },
      error: (err) => {
        console.error('Error deleting item:', err);
        
        this.toastMessage = 'Failed to remove item from wishlist. Please try again.';
        
        const toast = new bootstrap.Toast(this.toastElement.nativeElement);
        toast.show();
        
        setTimeout(() => this.showToast = false, 3000);
      }
    });
  
    const modalElement = document.getElementById('confirmModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }
  
  addToCart(wishlistItemId: number): void {
    this.wishlistService.addToCart(wishlistItemId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(item => item.wishlistItemId !== wishlistItemId);

        this.toastMessage = 'Product added successfully to cart';
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);

        const toast = new bootstrap.Toast(this.toastElement.nativeElement);
        toast.show();
      },
      error: (err) => {
        console.error('Error adding item to cart:', err);
        alert('Failed to add item to cart. Please try again.');
      }
    });
  }
  
  
  navigateToDetails(productId: number): void {
    this.router.navigate(['/details', productId]);
  }
  
  goToHome(): void {
    this.router.navigate(['/home']);
  }
  
}
