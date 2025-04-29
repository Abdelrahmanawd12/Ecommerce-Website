import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SellerService } from '../../../Services/SellerServ/seller.service';
import { debounceTime, distinctUntilChanged, Subject, tap, of } from 'rxjs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../../Models/Category';
import { environment } from '../../../Environment/Environment.prod';
import { EditProductPopupComponent } from '../edit-product-popup/edit-product-popup.component';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CurrencyPipe, CommonModule, FormsModule, MatDialogModule,RouterLink],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css'
})
export class ManageProductComponent {
  searchTerm: string = '';
  selectedStatus: string = 'All';
  suggestions: IProduct[] = [];
  showSuggestions: boolean = false;
  isLoading: boolean = false;
  allProducts: IProduct[] = [];
  products: IProduct[] = [];
  private searchTerms = new Subject<string>();

  @Output() productSelected = new EventEmitter<IProduct>();
  @Output() searchExecuted = new EventEmitter<string>();
  @Output() statusChanged = new EventEmitter<string>();

  statusOptions = [
    { name: 'All', active: true },
    { name: 'Pending', active: false },
    { name: 'Accepted', active: false },
    { name: 'Rejected', active: false },
  ];

  constructor(private sellerServ: SellerService, private dialog: MatDialog) { }

  readonly sellerId: string = localStorage.getItem('userId') || '';
  readonly imageBaseUrl = environment.imageBaseUrl;

  ngOnInit(): void {
    this.getProducts();
    const modalElement = document.getElementById('deleteConfirmModal');
    if (modalElement) {
      this.deleteModal = new window.bootstrap.Modal(modalElement);
    } else {
      console.error('Delete confirmation modal element not found');
    }
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isLoading = true),
      tap(term => this.searchTerm = term),
      tap(() => this.filterProducts()),
      tap(() => this.isLoading = false)
    ).subscribe();

  }

  getProducts(): void {
    this.isLoading = true;
    this.sellerServ.getAllProducts(this.sellerId).subscribe({
      next: (res) => {
        console.log('Products from API:', res); 
        this.allProducts = res;
        this.products = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  filterProducts(): void {
    let filtered = this.allProducts;
  
    if (this.selectedStatus !== 'All') {
      filtered = filtered.filter(p => 
        p.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }
  
    if (this.searchTerm.trim().length > 0) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  
    this.products = filtered;
  }
  

  selectStatus(selectedStatus: any): void {
    this.statusOptions.forEach(status => 
      status.active = status.name.toUpperCase() === selectedStatus.name.toUpperCase()
    );
    this.selectedStatus = selectedStatus.name;
    this.statusChanged.emit(this.selectedStatus);
    this.filterProducts();
  }
  
  onSearchChange(): void {
    this.searchTerms.next(this.searchTerm);
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.searchExecuted.emit(this.searchTerm);
      this.filterProducts();
    }
  }

  selectProduct(product: IProduct): void {
    this.productSelected.emit(product);
    this.searchTerm = product.name;
    this.showSuggestions = false;
  }
  clearSearch(): void {
    this.searchTerm = '';
    this.suggestions = [];
    this.filterProducts();
  }

  onBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  onProductSelected(product: IProduct): void {
    console.log('Selected product:', product);
  }

  onSearchExecuted(searchTerm: string): void {
    console.log('Search executed for:', searchTerm);
  }

  onStatusChange(status: string) {
    console.log('Selected status:', status);
  }

  getStockStatusClass(quantity: number): string {
    if (quantity <= 5) return 'stock-danger';
    if (quantity <= 20) return 'stock-warning';
    return 'stock-good';
  } 
  editProduct(product: IProduct) {
    const dialogRef = this.dialog.open(EditProductPopupComponent, {
      width: '600px',
      data: product
    });
    
    dialogRef.afterClosed().subscribe(updatedProduct => {
      if (updatedProduct) {
        const index = this.products.findIndex(p => p.productId === updatedProduct.productId);
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...updatedProduct };
        }
        this.getProducts(); 
      }
    });
  }
  
  selectedProductId: number | null = null;
  deleteModal: any;

  openDeleteModal(productId: number) {
    this.selectedProductId = productId;
    this.deleteModal.show();
  }

  confirmDelete() {
    const sellerId = localStorage.getItem('userId');
    if (this.selectedProductId != null) {
      this.sellerServ.deleteProduct(this.selectedProductId, sellerId!).subscribe({
        next: () => {
          this.showToast('Product marked as deleted successfully', 'success');
          this.getProducts(); 
          this.deleteModal.hide(); 
        },
        error: (error) => {
          this.showToast('Failed to mark product as deleted', 'danger');
          console.error('Failed to mark product as deleted:', error);
        }
      });
    }
  }
  
  showToast(message: string, type: 'success' | 'danger') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      return;
    }
  
    const toast = document.createElement('div');
    toast.classList.add('toast', 'fade', 'show', `bg-${type}`);
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
      <div class="toast-body">
        ${message}
      </div>
    `;
  
    toastContainer.appendChild(toast);
  
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
  
  

}



