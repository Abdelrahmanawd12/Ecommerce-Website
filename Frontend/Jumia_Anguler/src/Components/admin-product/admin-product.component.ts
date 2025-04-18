import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../Services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }
  staticProducts = [
    {
      name: 'Laptop',
      description: 'High-performance laptop with 16GB RAM',
      price: 1500
    },
    {
      name: 'Smartphone',
      description: 'Latest model with amazing camera',
      price: 999
    },
    {
      name: 'Headphones',
      description: 'Noise-cancelling wireless headphones',
      price: 199
    }
  ];
  
 
}


