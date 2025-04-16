import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../../Models/Category';
import { IProductSell } from '../../../Models/iproduct-sell';
import { SellerService } from '../../../Services/SellerServ/seller.service';

@Component({
  selector: 'app-edit-product-popup',
  imports: [MatDialogModule, FormsModule, CommonModule],
  templateUrl: './edit-product-popup.component.html',
  styleUrl: './edit-product-popup.component.css'
})
export class EditProductPopupComponent {
  updatedProduct: IProductSell;
  tagsInput: string = '';
  selectedImages: File[] = [];

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
    formData.append('ratingStars',this.updatedProduct.ratingStars.toString());

    // Tags
    const tagsArray = this.tagsInput.split(',').map(tag => tag.trim()).filter(t => t);
    tagsArray.forEach(tag => formData.append('Tags', tag));

    // Images
    this.selectedImages.forEach(file => formData.append('ImageUrls', file));

    this.sellerService.updateProduct(this.updatedProduct.productId, this.updatedProduct).subscribe({
      next: (response) => {
        console.log('Product updated successfully', response);
      },
      error: (error) => {
        console.error('Update failed', error);
    
        if (error.error && error.error.errors) {
          for (let key in error.error.errors) {
            console.log(`Validation error on ${key}:`, error.error.errors[key]);
          }
        }
      }
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
}
