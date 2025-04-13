import { Component, EventEmitter, Output } from '@angular/core';
import { SellerService } from '../../../Services/SellerServ/seller.service';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap, tap } from 'rxjs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellerDashboardSidebarComponent } from '../seller-dashboard-sidebar/seller-dashboard-sidebar.component';
import { IProduct } from '../../../Models/Category';

@Component({
  imports: [CurrencyPipe, CommonModule, FormsModule, SellerDashboardSidebarComponent],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css'
})
export class ManageProductComponent {
  searchTerm: string = '';
  suggestions: IProduct[] = [];
  showSuggestions: boolean = false;
  isLoading: boolean = false;
  allProducts: IProduct[] = []; // All products
  products: IProduct[] = [];    // products filtered
  private searchTerms = new Subject<string>();

  @Output() productSelected = new EventEmitter<IProduct>();
  @Output() searchExecuted = new EventEmitter<string>();
  statusOptions = [
    { name: 'All', active: true },
    { name: 'Pending', active: false },
    { name: 'Approved', active: false },
    { name: 'Rejected', active: false },
  ];

  @Output() statusChanged = new EventEmitter<string>();
  selectStatus(selectedStatus: any) {
    this.statusOptions.forEach(status => {
      status.active = status.name === selectedStatus.name;
    });

    if (selectedStatus.name === 'All') {
      this.products = this.allProducts;
    } else {
      this.products = this.allProducts.filter(p => p.status === selectedStatus.name);
    }

    this.statusChanged.emit(selectedStatus.name);
  }

  constructor(private sellerServ: SellerService) { }

  readonly sellerId: string = localStorage.getItem('userId') || '';
  readonly imageBaseUrl = 'https://localhost:7266/'; // عدلي حسب سيرفرك


  getProducts(): void {
    this.isLoading = true;
    this.sellerServ.getAllProducts(this.sellerId).subscribe({
      next: (res) => {
        this.allProducts = res;
        this.products = res; // نعرض الكل مبدئيًا
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.getProducts();

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isLoading = true),
      switchMap(term => term.length >= 2
        ? this.sellerServ.searchProducts(term)
        : of([])),
      tap(() => this.isLoading = false)
    ).subscribe(products => {
      this.suggestions = products;
    });
  }

  onSearchChange(): void {
    this.searchTerms.next(this.searchTerm);
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.searchExecuted.emit(this.searchTerm);
      this.showSuggestions = false;
      this.isLoading = true;
      this.sellerServ.searchProducts(this.searchTerm).subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  selectProduct(product: IProduct): void {
    this.productSelected.emit(product);
    this.searchTerm = product.name;
    this.showSuggestions = false;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  onProductSelected(product: IProduct): void {
    // Handle selected product
    console.log('Selected product:', product);
  }

  onSearchExecuted(searchTerm: string): void {
    // Handle search execution
    console.log('Search executed for:', searchTerm);
  }
  // في المكون الأب
  onStatusChange(status: string) {
    console.log('Selected status:', status);
    // قم بتنفيذ عملية التصفية هنا
  }
  getStockStatusClass(quantity: number): string {
    if (quantity <= 5) return 'stock-danger';
    if (quantity <= 20) return 'stock-warning';
    return 'stock-good';
  }

}


