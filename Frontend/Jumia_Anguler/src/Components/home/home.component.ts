import { Component, OnInit } from '@angular/core';
import { Icategory } from '../../Models/Icategory';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IProduct } from '../../Models/Iproduct';
import { CategoryService } from '../../Services/Customer/category.service';
import { ProductsService } from '../../Services/Customer/products.service';
import { CartService } from '../../Services/Customer/cart.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  CatList: Icategory[] = [] as Icategory[];
  PrdList: IProduct[] = [] as IProduct[];

  constructor(
    private _catService: CategoryService,
    private _product: ProductsService,
    private router: Router,
    private _CartServices: CartService
  ) { }

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
      },
      error: (err) => {
        console.log("error message ya awad", err)
      }
    });
  }
//add product to cart
  addToCart(product: IProduct): void {
    this._CartServices.addItemToCart(product).subscribe({
      next: (res) => {
        console.log("Product added to cart", res);
        alert("Product added to cart successfully!");
      },
      error: (err) => {
        console.log("error message ya awad", err);
        alert(err);

      }
    });
  }
}
