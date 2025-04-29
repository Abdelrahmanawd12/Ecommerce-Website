import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../Services/Customer/products.service';
import { CommonModule } from '@angular/common';
import { CartDTO } from '../../Models/cart';
import { IProduct } from '../../Models/Category';
import { CartService } from '../../Services/Customer/cart.service';
import { AwadWishlistService } from '../../Services/Customer/awad-wishlist.service';
import { environment } from '../../Environment/Environment.prod';
declare var bootstrap: any;



@Component({
  selector: 'app-product-details',
  imports: [FormsModule,CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  currentId:number=0;
  product!:IProduct;
  selectedQuantity: number = 1;
  cartData: CartDTO = {
    cartId: 0,
    customerName: '',
    items: []
  };
    readonly imgbaseUrl=environment.imageBaseUrl;


  //toast mess
toastMessage = '';
// toggle wishlist
wishlistProductIds: number[] = [];

toastClass: string = 'bg-success';
  constructor(
    private activerouter:ActivatedRoute,
    private _productservice:ProductsService,
    private _CartServices:CartService,
    private router:Router,
    private _wishlistService:AwadWishlistService,


  ) {}
// Get the user ID from local storage
  get user(): string {
    return localStorage.getItem('userId') || '';
  }
  //add to wishlist
  addToWishlist(productId: number): void {
    const userId = localStorage.getItem('userId')?.trim();
    const role = localStorage.getItem('role');
  
    if (role !== 'Customer' || !userId) {
      this.router.navigateByUrl("/login");
      return;
    }
    this._wishlistService.addToWishlist(userId, productId).subscribe({
      next: (res) => {
        console.log("Product added to wishlist", res);
        //toggle the wishlist state
        this.wishlistProductIds.push(productId);

        this.showToast("Product added to wishlist successfully!", 'success');
      },
      error: (err) => {
        console.log("error", err);
        const errorMsg = err?.error?.message || "Something went wrong!";
        this.showToast(errorMsg, 'error');
      }
    });
  }
  //remove from wishlist
  removeFromWishlist(productId: number): void {
    const userId = localStorage.getItem('userId')?.trim();
    const role = localStorage.getItem('role');
  
    if (role !== 'Customer' || !userId) {
      this.router.navigateByUrl("/login");
      return;
    }
    this._wishlistService.removeFromWishlist(userId, productId).subscribe({
      next: (res) => {
        console.log("Product removed from wishlist", res);
        //toggle the wishlist state
        this.wishlistProductIds = this.wishlistProductIds.filter(id => id !== productId);
        this.showToast("Product removed from wishlist successfully!", 'success');
      },
      error: (err) => {
        console.log("error", err);
        const errorMsg = err?.error?.message || "Something went wrong!";
        this.showToast(errorMsg, 'error');
      }
    });
  }

  ngOnInit(): void {
    //get product by id from url
    this.activerouter.paramMap.subscribe((paramMap)=>{
      this.currentId=Number(paramMap.get('id'))
      this._productservice.getProductById(this.currentId).subscribe({
        next:(data)=>{
          this.product=data
        // get related products
          this.getRelatedProducts();
        },
        error:(err)=>{
          console.log(err)
        }
      })
    });
    this._CartServices.getCart(this.user).subscribe({
      next: (data) => {
        this.cartData = data;
      },
      error: (err) => {
        console.log("Error loading cart data", err);
      }
    });
    // Check if the user is logged in and fetch wishlist items`
    if (this.user) {
      this._wishlistService.getWishlist(this.user).subscribe({
        next: (wishlist) => {
          this.wishlistProductIds = wishlist.wishlistItems
          .map(p => p.products.find(i => i.productId)?.productId || 0)
          .filter(id => id !== 0);
                },
        error: (err) => {
          console.error("Error fetching wishlist", err);
        }
      });
    }


  }
// toggle to check if the product is in the wishlist
  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds.includes(productId);
  }
  toggleWishlist(productId: number): void {
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(productId);
    }
  }


  get alreadyInCartQty(): number {
    const item = this.cartData.items.find(i => i.productId === this.product?.productId);
    return item ? item.quantity : 0;
  }

  get maxAvailableQuantity(): number {
    return this.product.quantity - this.alreadyInCartQty;
  }

  validateQuantity(): void {
    if (this.selectedQuantity > this.maxAvailableQuantity) {
      this.selectedQuantity = this.maxAvailableQuantity;
    } else if (this.selectedQuantity < 1) {
      this.selectedQuantity = 1;
    }
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
//from item itself
  addToCart(product: IProduct): void {
    const userId = localStorage.getItem('userId')?.trim();
    const role = localStorage.getItem('role');
  
    if (role !== 'Customer' || !userId) {
      this.router.navigateByUrl("/login");
      return;
    }
    const totalRequestedQty = this.selectedQuantity + this.alreadyInCartQty;

    if (this.selectedQuantity <= 0 || totalRequestedQty > product.quantity) {
      this.showToast(`Please enter a valid quantity (you already have ${this.alreadyInCartQty} in cart, max allowed is ${product.quantity})`);
      return;
    }

    this._CartServices.addItemToCart(product, this.selectedQuantity).subscribe({
      next: (res) => {
        console.log("Product added to cart", res);
        this,this.showToast("Product added to cart successfully!","success");
        this.ngOnInit();
      },
      error: (err) => {
        console.log("error", err);
        this.showToast("Something went wrong!","error");
      }
    });
  }
//add to cart from related div
addToCartFromRelated(product: IProduct): void {
  const userId = localStorage.getItem('userId')?.trim();
  const role = localStorage.getItem('role');

  if (role !== 'Customer' || !userId) {
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
  checkQuantity(): void {
    if (this.selectedQuantity > this.maxAvailableQuantity) {
      this.selectedQuantity = this.maxAvailableQuantity; // Limit quantity to available stock
    }
  }
  get averageRating(): number {
    if (this.product.ratingStars && this.product.ratingStars.length > 0) {
      let sum = this.product.ratingStars.reduce((acc, rating) => acc + rating, 0);
      return sum / this.product.ratingStars.length;
    }
    return 0;
  }

  get fullStars(): number {
    return Math.floor(this.averageRating);
  }

  get halfStars(): boolean {
    return (this.averageRating % 1) >= 0.5;
  }

  get emptyStars(): number {
    return 5 - Math.ceil(this.averageRating);
  }
  //display related products
  relatedProducts!: IProduct[] ;
  getRelatedProducts(): void {
    this._productservice.getAllProducts().subscribe({
      next: (products) => {
        this.relatedProducts = products.filter(p =>
          p.subCategoryName === this.product.subCategoryName &&
          p.productId !== this.product.productId // exclude current product
        ).sort(() => 0.5 - Math.random()).slice(0,6);
      },
      error: (err) => {
        console.log("Error fetching related products", err);
      }
    });
  }
  goToProductDetails(productId: number): void {
    this.router.navigate(['/details', productId]);
  }

}




