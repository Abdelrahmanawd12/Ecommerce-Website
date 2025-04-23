import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IProduct, Isubcategory } from '../../../Models/Category';
import { IProductSell } from '../../../Models/iproduct-sell';
import { SellerService } from '../../../Services/SellerServ/seller.service';

@Component({
  selector: 'app-edit-product-popup',
  imports: [MatDialogModule, FormsModule, CommonModule],
  templateUrl: './edit-product-popup.component.html',
  styleUrl: './edit-product-popup.component.css'
})
export class EditProductPopupComponent implements OnInit {
  updatedProduct: IProductSell;
  tagsInput: string = '';
  selectedImages: File[] = [];
  subcategories: Isubcategory[] = [];
selectedSubcategoryId: number | null = null;
selectedSubcategoryName: string | null = null;
readonly sellerId = localStorage.getItem('userId');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IProductSell,

    private dialogRef: MatDialogRef<EditProductPopupComponent>,
    private sellerService: SellerService
  ) {
    this.updatedProduct = { 
      ...data, 
      subCategoryName: data.subCategoryName || '' 
    };
    this.tagsInput = (data.tags || []).join(', ');
  }
  ngOnInit(): void {
    this.loadSubcategories();
  }

  onImageSelected(event: any) {
    this.selectedImages = Array.from(event.target.files);
  }
  saveChanges() {
    const formData = new FormData();
  
    formData.append('Name', this.updatedProduct.name);
    formData.append('Description', this.updatedProduct.description);
    formData.append('Price', this.updatedProduct.price.toString());
    formData.append('Quantity', this.updatedProduct.quantity.toString());
    formData.append('Brand', this.updatedProduct.brand);
    formData.append('Discount', this.updatedProduct.discount.toString());
    formData.append('Weight', this.updatedProduct.weight.toString());
    formData.append('SubCategoryId', this.selectedSubcategoryId?.toString() || '');
    formData.append('SubCategoryName', this.selectedSubcategoryName || '');
    formData.append('SellerId', this.sellerId ? this.sellerId.toString() : '');
  
    // Tags
    const tagsArray = this.tagsInput.split(',').map(tag => tag.trim()).filter(t => t);
    tagsArray.forEach(tag => formData.append('Tags', tag));
  
    if (this.selectedImages.length === 0 && this.updatedProduct.imageUrls?.length) {
      this.updatedProduct.imageUrls.forEach(url => {
        formData.append('ImageUrls', url);  
      });
    } else {
      this.selectedImages.forEach(file => formData.append('ImageUrls', file));
    }
  
    this.sellerService.updateProduct(this.updatedProduct.productId, formData).subscribe({
      next: (response) => {
        console.log('Product updated successfully', response);
        this.showSuccessToast();  
        this.dialogRef.close(true);  
      },
      error: (error) => {
        console.error('Update failed', error);
        this.showErrorToast();  
      }
    });
  
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
  }
  
  

  showSuccessToast() {
    const toast = document.getElementById('successToast');
    if (toast) {
      const bsToast = new (window as any).bootstrap.Toast(toast);
      bsToast.show();
    }
  }

  showErrorToast() {
    const toast = document.getElementById('errorToast');
    if (toast) {
      const bsToast = new (window as any).bootstrap.Toast(toast);
      bsToast.show();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  loadSubcategories() {
    this.sellerService.getAllSubcategories().subscribe({
      next: (data) => {
        this.subcategories = Array.isArray(data) ? data : [data];
      },
      error: (err) => {
        console.error('Error loading subcategories:', err);
      }
    });
  }
  onSubcategoryChange(event: any): void {
    const selectedId = +event.target.value;
    this.selectedSubcategoryId = selectedId;
    const selected = this.subcategories.find(s => s.subCatId === selectedId);
    this.selectedSubcategoryName = selected?.subCatName || null;
  
    console.log('Selected ID:', this.selectedSubcategoryId);
    console.log('Selected Name:', this.selectedSubcategoryName);
  }
  
}
