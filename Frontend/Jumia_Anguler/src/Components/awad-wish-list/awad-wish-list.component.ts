import { Component, OnInit } from '@angular/core';
import { AwadWishlistService } from '../../Services/Customer/awad-wishlist.service';
import { AwadWishlistDTO, AwadWishlistItemDTO } from '../../Models/AwadWishlist';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CategoryScale } from 'chart.js';
import { CategoryService } from '../../Services/Customer/category.service';
import { Icategory, IProduct } from '../../Models/Category';
import { CartService } from '../../Services/Customer/cart.service';
import { environment } from '../../Environment/Environment.prod';
declare var bootstrap: any;


@Component({
  selector: 'app-awad-wish-list',
  imports: [CommonModule,RouterLink],
  templateUrl: './awad-wish-list.component.html',
  styleUrl: './awad-wish-list.component.css'
})
export class AwadWishListComponent implements OnInit {
  wishlistData: AwadWishlistDTO = {
    wishlistId: 0,
    customerName: '',
    wishlistItems: []
  };  // wishlistItemsData: AwadWishlistItemDTO|null = null;
  isLoading = true;
  errorMessage = '';
    CatList: Icategory[] = [] as Icategory[];
    selectedQuantity: number = 1;
//toast mess
toastMessage = '';
toastClass: string = 'bg-success';
  readonly imgbaseUrl=environment.imageBaseUrl;


  constructor(private wishlistService: AwadWishlistService,
    private _catService:CategoryService,
      private router:Router,
    private _CartServices:CartService
   )
       {}

  get userId(): string {
    return localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {

    this._catService.getAllCategories().subscribe({
      next: (data) => {
        this.CatList = data;
      },
      error: (err) => {
        console.log("error message ya awad", err)
      }
    });
    this.loadWishlist();

  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.getWishlist(this.userId).subscribe({
      next: (res) => {
        this.wishlistData = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load wishlist';
        this.isLoading = false;
        this.wishlistData = {
          wishlistId: 0,
          customerName: '',
          wishlistItems: []
        };
      }
    });
  }

  removeItem(productId: number): void {
    this.wishlistService.removeFromWishlist(this.userId, productId).subscribe({
      next: () => {
        this.wishlistData!.wishlistItems.forEach(item => {
          item.products = item.products.filter(product => product.productId !== productId);
        });

        this.wishlistData!.wishlistItems = this.wishlistData!.wishlistItems.filter(item => item.products.length > 0);

        this.showToast("Product removed from wishlist", 'success');
      },
      error: () => {
        alert('Failed to remove item');
      }
    });
  }


  clearWishlist(): void {
    this.wishlistService.clearWishlist(this.userId).subscribe({
      next: () => {
        this.wishlistData!.wishlistItems = [];
      },
      error: () => {
        alert('Failed to clear wishlist');
      }
    });
  }

    addToCart(product: IProduct): void {
      const userId = localStorage.getItem('userId');

      if (!userId || userId.trim() === '') {
        this.router.navigateByUrl("/login");
        return;
      }
      this._CartServices.addItemToCart(product, this.selectedQuantity).subscribe({
        next: (res) => {
          console.log("Product added to cart", res);
          this.showToast("Product added to cart successfully!", 'success');
        },
        error: (err) => {
          console.log("error", err);
          const errorMsg = err?.error?.message || "Something went wrong!";
          this.showToast(errorMsg, 'error');
        }

      });
    }
    //toast mess
showToast(message: string, type: 'success' | 'error' = 'success') {
  this.toastMessage = message;
  this.toastClass = type === 'success' ? 'bg-success' : 'bg-danger';

  const toastEl = document.getElementById('cartToast');
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  } else {
    console.error('Toast element not found');
  }
}

}
