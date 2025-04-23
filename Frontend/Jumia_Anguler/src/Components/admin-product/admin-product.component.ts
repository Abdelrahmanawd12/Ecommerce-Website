import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../Services/AdminServ/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../Models/Category';
import { environment } from '../../Environment/Environment.prod';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {
  products: Product[] = [];
  pendingProducts: IProduct[] = [];
  sellerNames: { [key: number]: string } = {}; // productId -> seller name
  loading = true;
  readonly imgBase = environment.imageBaseUrl;

  toastMessage: string = '';
  toastType: 'success' | 'danger' = 'success';

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPendingProducts();
  }

  getPendingProducts() {
    this.productService.getAllPendingProducts().subscribe({
      next: (products) => {
        this.pendingProducts = products;
        this.loading = false;
        console.log('Pending products:', products);

        for (let product of products) {
          if (product.productId != null) {
            this.getSellerName(product.productId);
          } else {
            console.warn('Missing product ID:', product);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching pending products:', err);
        this.loading = false;
      }
    });
  }

  getSellerName(productId: number) {
    if (!productId) {
      console.warn(`Missing product ID:`, productId);
      return;
    }

    this.productService.getSellerName(productId).subscribe({
      next: (name) => {
        this.sellerNames[productId] = name;
      },
      error: (err) => {
        console.error(`Error fetching seller name for product ${productId}:`, err);
        this.sellerNames[productId] = 'Unknown';
      }
    });
  }


  changeProductStatus(productId: number, status: 'Accepted' | 'Rejected') {
    this.pendingProducts = this.pendingProducts.filter(p => p.productId !== productId);
  
    this.productService.changeProductStatus(productId, status).subscribe({
      next: (res) => {
        this.showToast(`Product ${status} successfully`, 'success');
        console.log('Sending:', { value: status });
      },
      error: (err) => {
        console.error(`Error changing status to ${status} for product ${productId}`, err);
        this.showToast(`Failed to ${status} product`, 'danger');
  
        this.getPendingProducts();
      }
    });
  }
  


  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;

    // Hide the toast after 3 seconds
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

}
