import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CartDTO } from '../../Models/cart';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../Services/Customer/cart.service';
import { environment } from '../../Environment/Environment.prod';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  customerId = localStorage.getItem('userId') || '';
  grandTotal: number = 0;
  cartData: CartDTO = {
    cartId: 0,
    customerName: '',
    items: []
  };
  //confirm modal
  confirmMessage: string = '';
  private confirmCallback!: () => void;
  private modalRef: any;
  //image base url
  readonly imgbaseUrl = environment.imageBaseUrl;

  constructor(private cartService: CartService, private router: Router) { }


  ngOnInit(): void {

    this.loadCart();
    this.calculateTotal();
  }
  //load
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
  //calculate total after discount
  calculateTotal() {
    if (!this.cartData?.items?.length) {
      this.grandTotal = 0;
      return;
    }

    this.grandTotal = this.cartData.items
      .filter(item => item.productStock > 0)
      .reduce((total, item) => {
        const validQuantity = Math.min(item.quantity, item.productStock);
        return total + (item.price - item.discount) * validQuantity;
      }, 0);
  }


  // Show modal with dynamic message and callback
  showConfirmation(message: string, callback: () => void) {
    this.confirmMessage = message;
    this.confirmCallback = callback;

    const modalElement = document.getElementById('confirmModal');
    this.modalRef = new bootstrap.Modal(modalElement);
    this.modalRef.show();
  }

  confirmAction() {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.modalRef.hide();
  }



//clear item from cart
removeItem(item: any) {
  this.showConfirmation(`Are you sure you want to remove "${item.productName}" from the cart?`, () => {
    this.cartService.removeItemFromBackend(this.customerId, item.productId).subscribe({
      next: () => {
        this.cartData.items = this.cartData.items.filter(p => p.productId !== item.productId);
        this.calculateTotal();
        this.loadCart();
        this.cartService.updateCartCount(this.cartData.items.length);// Update cart count in the service

      },
      error: err => console.error(err)
    });
  });
}

//  clearCart
clearCart() {
  this.showConfirmation('Are you sure you want to clear the entire cart?', () => {
    this.cartService.clearCart(this.customerId).subscribe(() => {
      this.cartData.items = [];
      this.calculateTotal();
      this.loadCart();
      this.cartService.updateCartCount(this.cartData.items.length); // Update cart count in the service
    });
  });
}

//decrease quantity
  decrease(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateItem(this.customerId, item.productId, -1).subscribe({
        next: () => this.calculateTotal(),
        error: err => console.error(err)
      });
    }
  }
//increase quantity
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

  checkout() {
    this.cartService.getCart(this.customerId).subscribe(order => {
      const cleanOrder = JSON.parse(JSON.stringify(order));
      console.log("Clean Order: ", cleanOrder);

      localStorage.setItem('order', JSON.stringify(cleanOrder));
      this.router.navigate(['/checkout']);
    });
    
  }

}


