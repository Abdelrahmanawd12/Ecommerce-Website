import { Component, OnInit } from '@angular/core';
import { Icategory } from '../../Models/Category';

import { Router, RouterLink, RouterModule} from '@angular/router';
import { IProduct } from '../../Models/Category';
import { CartDTO } from '../../Models/cart';
import { CartService } from '../../Services/Customer/cart.service';
import { CategoryService } from '../../Services/Customer/category.service';
import { ProductsService } from '../../Services/Customer/products.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatBotAiComponent } from "../chat-bot-ai/chat-bot-ai.component";
declare var bootstrap: any;


@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  CatList: Icategory[] = [] as Icategory[];
  PrdList: IProduct[] = [] as IProduct[];
  SixProducts: IProduct[] = [] as IProduct[];
  randomProducts: IProduct[] = [] as IProduct[];
  TopCheapestItems: IProduct[] = [] as IProduct[];
  HighstOffer: IProduct[] = [] as IProduct[];
  TopRatedProducts: IProduct[] = [] as IProduct[];
  selectedQuantity: number = 1;

  // user= localStorage.getItem('userId') || '';

   cartData: CartDTO = {
      cartId: 0,
      customerName: '',
      items: []
    };
//toast mess
toastMessage = '';
toastClass: string = 'bg-success';

  constructor(
    private _catService: CategoryService,
    private _product: ProductsService,
    private router: Router,
    private _CartServices: CartService
  ) { }


  //get user
  get user(): string {
    return localStorage.getItem('userId') || '';
  }


// get All Category
  ngOnInit(): void {

    this._catService.getAllCategories().subscribe({
      next: (data) => {
        this.CatList = data;
      },
      error: (err) => {
        console.log("error message ya awad", err)
      }
    });

// get All Products
    this._product.getAllProducts().subscribe({
      next: (data) => {
        this.PrdList = data;
        this.PrdList.forEach((product) => {
          Object.assign(product, { totalPrice: product.price, quantity: 1 });
        });
        //display first 6 products
        this.getSixProducts();
        //display random 6 products
        this.getRandomProducts();
        //display Top cheapest items
        this.getTopCheapestItems();
        //display exclusive offers
        this.getHighestOffer();
        //display top rating products
        this.getTopRatedProducts();

      },
      error: (err) => {
        console.log("error message ya awad", err)
      }
    });
    //get cart
    this._CartServices.getCart(this.user).subscribe({
      next: (data) => {
        this.cartData = data;
      },
      error: (err) => {
        console.log("Error loading cart data", err);
      }
    });
  }
  // go to details page for product
  goToProductDetails(productId: number): void {
    this.router.navigate(['/details', productId]);
  }
  //display first product
  getSixProducts(): IProduct[] {
    this.SixProducts= this.PrdList.slice(0, 6);
    return this.SixProducts;
  }
  //display random 6 product
  getRandomProducts(): IProduct[] {
    this.randomProducts = this.PrdList.sort(() => 0.5 - Math.random()).slice(0, 6);
    return this.randomProducts;
  }
//display Top cheapest items
  getTopCheapestItems(): IProduct[] {
    this.TopCheapestItems= this.PrdList.sort((a, b) => a.price - b.price).slice(0, 6);
    return this.TopCheapestItems;
  }
  // exclusive offers
  getHighestOffer(): IProduct[] {
    this.HighstOffer= this.PrdList.sort((a, b) => (b.discount) - (a.discount)).slice(0, 6);
    return this.HighstOffer;
  }
  //top rating
  getTopRatedProducts(): IProduct[] {
    this.TopRatedProducts= this.PrdList
      .sort((a, b) => {
        const aAvg = a.ratingStars.length ? a.ratingStars.reduce((acc, val) => acc + val, 0) / a.ratingStars.length : 0;
        const bAvg = b.ratingStars.length ? b.ratingStars.reduce((acc, val) => acc + val, 0) / b.ratingStars.length : 0;

        return bAvg - aAvg;
      })
      .slice(0, 6);
      return this.TopRatedProducts;
  }
  //show toast
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
  //add to cart

  addToCart(product: IProduct): void {
    const userId = localStorage.getItem('userId');

    if (!userId || userId.trim() === '') {
      this.router.navigateByUrl("/login");
      return;
    }

    this._CartServices.addItemToCart(product, this.selectedQuantity).subscribe({
      next: (res) => {
        console.log("Product added to cart", res);
        this.showToast("Product added to cart successfully!","success");
        this.ngOnInit();

      },
      error: (err) => {
        console.log("error", err);
        const errorMsg = err?.error?.message || "Something went wrong!";
        this.showToast(errorMsg,"error");
      }

    });
  }

}
