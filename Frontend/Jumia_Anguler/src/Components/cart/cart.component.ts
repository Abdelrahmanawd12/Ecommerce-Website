import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CartDTO } from '../../Models/cart';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import e from 'express';
import { CartService } from '../../Services/Customer/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule , FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements  OnInit {
  customerId: string = 'user1';
  grandTotal: number = 0;
  cartData: CartDTO = {
    cartId: 0,
    customerName: '',
    items: []
  };

  constructor(private cartService: CartService) {}


  ngOnInit(): void {

    this.loadCart();
    this.calculateTotal();
  }

  loadCart() {
    this.cartService.getCart(this.customerId).subscribe({
      next: (res) => {
        this.cartData = res;
        console.log(this.cartData);  // Debugging line

        this.calculateTotal();
      },
      error: () => {
        this.cartData = { cartId: 0, customerName: '', items: [] };
      }
    });
  }

  calculateTotal() {
    this.grandTotal = this.cartData.items.reduce((total, item) => {
      return total + (item.price-item.discount) * item.quantity;
    }, 0);
  }

  removeItem(item: any) {
    const confirmed = window.confirm(`Are you sure you want to remove "${item.productName}" from the cart?`);
    if (!confirmed) return;

    this.cartService.removeItemFromBackend(this.customerId, item.productId).subscribe({
      next: () => {
        this.cartData.items = this.cartData.items.filter(p => p.productId !== item.productId);
        this.calculateTotal();
        this.loadCart();
      },
      error: err => console.error(err)
    });
  }


  clearCart() {
    const confirmed = window.confirm('Are you sure you want to clear the entire cart?');
    if (!confirmed) return;

    this.cartService.clearCart(this.customerId).subscribe(() => {
      this.cartData.items = [];
      this.calculateTotal();
      this.loadCart();
    });
  }


  decrease(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateItem(this.customerId, item.productId, -1).subscribe({
        next: () => this.calculateTotal(),
        error: err => console.error(err)
      });
    }
  }

  increase(item: any,stock: number) {
    console.log('Stock available:', stock);  // Debugging line

    if (item.quantity < stock) {
      item.quantity += 1;
      this.cartService.updateItem(this.customerId, item.productId, 1).subscribe({
        next: () => this.calculateTotal(),
        error: err => console.error(err)
      });
    }else {
      alert(`Only ${stock} items available in stock`);
    }
  }


  }


