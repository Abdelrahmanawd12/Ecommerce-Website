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
    formData.append('SubCategoryName', this.selectedSubcategoryName?.toString() || '');
    formData.append('SellerId', this.sellerId ? this.sellerId.toString() : '');
  
    const tagsArray = this.tagsInput.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  
    tagsArray.forEach((tag, index) => {
      formData.append(`Tags[${index}]`, tag);
    });
  
    let imageUrls: (File | string)[] = [];
  
    // لو المستخدم اختار صور جديدة
    if (this.selectedImages.length > 0) {
      imageUrls = [...this.selectedImages];
    }
    // لو لأ، نستخدم الصور القديمة
    else if (this.existingImages.length > 0) {
      imageUrls = [...this.existingImages];
    }
  
    // نحط الصور لو موجودة
    imageUrls.forEach((img) => {
      if (img instanceof File) {
        formData.append('ImageUrls', img);
      } else if (typeof img === 'string') {
        formData.append('ImageUrls', img);
      }
    });
  
    // بعدين نعمل الريكوست
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
  getImageUrl(image: string | File): string {
    return image instanceof File ? URL.createObjectURL(image) : image;
  }

}
