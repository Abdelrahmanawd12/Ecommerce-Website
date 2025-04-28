import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IProduct, Isubcategory } from '../../../Models/Category';
import { IProductSell } from '../../../Models/iproduct-sell';
import { SellerService } from '../../../Services/SellerServ/seller.service';
import { environment } from '../../../Environment/Environment.prod';

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
  readonly imgBase = environment.imageBaseUrl;
  existingImages: string[] = [];
  selectedExistingImage: string | null = null;
  deletedImages: string[] = [];
  lastDeletedImage: string | null = null; 

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
    if (this.updatedProduct.imageUrls?.length && (!this.selectedImages || this.selectedImages.length === 0)) {
      this.selectedImages = [];
      this.updatedProduct.imageUrls.forEach(url => {
        this.selectedImages.push(url);
      });
    }
    this.existingImages = [];
    this.updatedProduct.imageUrls?.forEach(image => {
      if (typeof image === 'string') {
        this.existingImages.push(image);
      }
    });
  }

  onImageSelected(event: any) {
    const newImage = event.target.files[0]; 
  
    if (this.existingImages.includes(newImage.name) || this.selectedImages.some(file => file.name === newImage.name)) {
      this.showErrorToast('Image already exists');
    } else {
      this.selectedImages.push(newImage); 
    }
  }

  saveChanges() {
    const productData = {
      name: this.updatedProduct.name,
      description: this.updatedProduct.description,
      price: this.updatedProduct.price,
      quantity: this.updatedProduct.quantity,
      brand: this.updatedProduct.brand,
      discount: this.updatedProduct.discount,
      weight: this.updatedProduct.weight,
      subCategoryId: this.selectedSubcategoryId,
      sellerId: this.sellerId,
      tags: this.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
  
    const imagesFormData = new FormData();
  
    this.existingImages.forEach((url) => {
      imagesFormData.append('ImageUrls', url);
    });
  
    this.selectedImages.forEach((file) => {
      imagesFormData.append('ImageUrls', file);
    });
  
  
    this.sellerService.updateProduct(this.updatedProduct.productId, productData).subscribe({
      next: (response) => {
        console.log('Product details updated successfully', response);
  
        if (this.selectedImages.length > 0 || this.existingImages.length > 0 || this.deletedImages.length > 0) {
          this.sellerService.updateProductWithImage(this.updatedProduct.productId, imagesFormData).subscribe({
            next: (imgResponse) => {
              console.log('Product images updated successfully', imgResponse);
              this.showSuccessToast();
              this.dialogRef.close(true);
            },
            error: (imgError) => {
              console.error('Updating images failed', imgError);
              this.showErrorToast('Updating images failed');
            }
          });
        } else {
          this.showSuccessToast();
          this.dialogRef.close(true);
        }
      },
      error: (error) => {
        console.error('Updating product details failed', error);
        this.showErrorToast('Updating product details failed');
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

  showErrorToast(p0: string) {
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

        if (this.updatedProduct.subCategoryId) {
          const selected = this.subcategories.find(s => s.subCatId === this.updatedProduct.subCategoryId);
          if (selected) {
            this.selectedSubcategoryId = selected.subCatId;
            this.selectedSubcategoryName = selected.subCatName;
          }
        }
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

  selectExistingImage(url: string) {
    this.selectedExistingImage = url;
    console.log('Selected image:', url);
  }

  
deleteExistingImage(index: number, event: Event): void {
  event.stopPropagation(); 

  const deletedImage = this.existingImages[index]; 
  this.existingImages.splice(index, 1);  // Remove the image from existing images
  this.deletedImages.push(deletedImage);  // Add the deleted image to the deletedImages array

  // Call the delete service to delete the image from the backend
  this.sellerService.deleteImageFromProduct(this.updatedProduct.productId, [deletedImage])
    .subscribe({
      next: (response) => {
        console.log('Image deleted successfully', response);
        this.showSuccessToast();
      },
      error: (error) => {
        console.error('Deleting image failed', error);
        this.showErrorToast('Deleting image failed');
      }
    });
}

// Confirm before deleting the image
confirmDeleteImage(index: number) {
  const confirmed = window.confirm('Are you sure you want to delete this image?');
  if (confirmed) {
    this.lastDeletedImage = this.existingImages[index];
    this.deleteExistingImage(index, new Event('click'));  // Call deleteExistingImage with the index
  }
}


undoDelete() {
  if (this.lastDeletedImage) {
    this.existingImages.push(this.lastDeletedImage);
    this.lastDeletedImage = null;
  }
}
}
