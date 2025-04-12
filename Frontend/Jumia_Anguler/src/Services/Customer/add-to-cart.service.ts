import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct } from '../../Models/Iproduct';

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {
cartItemList:any = [];
productList:any = new BehaviorSubject<any>([]);
  constructor() { }
  getProducts(){
    return this.productList.asObservable();
  }
  setProduct(product:IProduct[]){
    this.cartItemList.push(...product);
    this.productList.next(product);
  }
  addToCart(product:IProduct){
    this.cartItemList.push(product);
    this.productList.next(this.cartItemList);
    this.getTotalPrice();
    console.log("product added to cart", this.cartItemList);
  }
  getTotalPrice():number{
    let grandTotal = 0;
    this.cartItemList.map((a:any)=>{
      grandTotal += a.totalPrice;
    })
    return grandTotal;
  }
  removeCartItem(product:IProduct){
    this.cartItemList.map((a:any, index:any)=>{
      if(product.productId === a.productId){
        this.cartItemList.splice(index,1);
      }
    })
    this.productList.next(this.cartItemList);
  }
  removeAllCart(){
    this.cartItemList = [];
    this.productList.next(this.cartItemList);
  }

}
