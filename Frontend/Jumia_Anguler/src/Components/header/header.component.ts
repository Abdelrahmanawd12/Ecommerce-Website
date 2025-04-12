import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AddToCartService } from '../../Services/Auth/Customer/add-to-cart.service';
import { CartService } from '../../Services/Auth/Customer/cart.service';
import { IProduct } from '../../Models/Category';

@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  user=  'user1';
  public totalItem: number = 0;
  product!: IProduct;

  constructor(private router: Router, private _CartService: CartService) { }

  ngOnInit(): void {
    this._CartService.cartItemCount$.subscribe(count => {
      this.totalItem = count;
    });

    this._CartService.getCart("user1").subscribe(cart => {
      this._CartService.updateCartCount(cart.items.length);
    });
  }


  // addToCart(product: IProduct) {
  //   this._CartService.addItemToCart(product).subscribe({
  //     next: (res) => {
  //       this.totalItem = res.totalItems;
  //     },
  //     error: (err) => {
  //       console.error("Error adding item to cart", err);
  //     }
  //   });
  // }
}
