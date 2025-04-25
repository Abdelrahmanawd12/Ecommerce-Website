import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Categories } from '../../../Models/categories';
import { SubCategories } from '../../../Models/sub-categories';
import { SellerService } from '../../../Services/SellerServ/seller.service';

@Component({
  selector: 'app-add-product-dashboard',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './add-product-dashboard.component.html',
  styleUrl: './add-product-dashboard.component.css'
})
export class AddProductDashboardComponent {

  sellerId = localStorage.getItem('userId');
  currentStep: number = 1;
  // Add these properties
  productDescription: string = '';
  tags: string[] = [];
  categories: Categories[] = [];
  subCategories: SubCategories[] = [];
  AddProductForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private addProductService: SellerService) {
    this.AddProductForm = this.fb.group({
      images: [[], [Validators.required, Validators.minLength(1)]],
      productname: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/)]],
      brand: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/)]],
      cat: ['', [Validators.required]],
      subcat: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern(/^(?!0+(\.0{1,2})?$)\d+(\.\d{1,2})?$/)]],
      quantity: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      discount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0.01), Validators.max(100)]],
      weight: ['', [Validators.required, Validators.pattern(/^(?!0$)\d+(\.\d{1,2})?$/)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()\-\n\r]+$/)]],
      tags: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s,]+$/)]]

    })
  }

  get image(): FormArray { return this.AddProductForm.get('images') as FormArray; }
  get productname() { return this.AddProductForm.get('productname') }
  get brand() { return this.AddProductForm.get('brand') }
  get cat() { return this.AddProductForm.get('cat') }
  get subcat() { return this.AddProductForm.get('subcat') }
  get price() { return this.AddProductForm.get('price') }
  get quantity() { return this.AddProductForm.get('quantity') }
  get discount() { return this.AddProductForm.get('discount') }
  get weight() { return this.AddProductForm.get('weight') }
  get description() { return this.AddProductForm.get('description') }
  get tag() { return this.AddProductForm.get('tags') }

  onSubmit() {
    if (this.AddProductForm.valid) {
      const formData = new FormData();

      this.appendFormValue(formData, 'Name', this.AddProductForm.get('productname')?.value);
      this.appendFormValue(formData, 'Brand', this.AddProductForm.get('brand')?.value);
      this.appendFormValue(formData, 'Price', this.AddProductForm.get('price')?.value);
      this.appendFormValue(formData, 'Quantity', this.AddProductForm.get('quantity')?.value);
      this.appendFormValue(formData, 'Discount', this.AddProductForm.get('discount')?.value);
      this.appendFormValue(formData, 'Weight', this.AddProductForm.get('weight')?.value);
      this.appendFormValue(formData, 'Description', this.AddProductForm.get('description')?.value);
      this.appendFormValue(formData, 'SellerId', this.sellerId);

      const subCatId = this.AddProductForm.get('subcat')?.value;
      if (subCatId) {
        formData.append('SubCategoryId', subCatId.toString());

        const selectedSubCat = this.subCategories.find(cat => cat.subCatId == subCatId);
        if (selectedSubCat) {
          console.log('SubCategoryName to be sent:', selectedSubCat.subCatName);
          formData.append('SubCategoryName', selectedSubCat.subCatName);
        } else {
          console.warn('Selected subcategory not found in subCategories array');
        }
      }

      this.images.forEach((img, index) => {
        if (img?.file) {
          formData.append('ImageUrls', img.file, `image_${index}.${img.file.name.split('.').pop()}`);
        }
      });

      this.tags.forEach((tag, index) => {
        formData.append(`Tags[${index}]`, tag);
      });

      this.logFormData(formData);

      this.addProductService.addProduct(formData).subscribe({
        next: (res) => {
          this.displayToast('success', 'Product added successfully!');
          this.resetForm();
        },
        error: (err) => {
          this.displayToast('error', 'Error adding product. Please try again.');
          console.error('Error:', err);
        }
      });
    }
  }

  private appendFormValue(formData: FormData, key: string, value: any): void {
    if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  }

  private logFormData(formData: FormData): void {
    console.log('--- FormData Content ---');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  }

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  private displayToast(type: 'success' | 'error', message: string) {
    this.toastType = type;
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  hideToast() {
    this.showToast = false;
  }

  private resetForm() {
    this.AddProductForm.reset();
    this.currentStep = 1;
    this.images = [];
    this.tags = [];

    this.AddProductForm.patchValue({
      discount: 0,
      weight: 0
    });
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
      setTimeout(() => {
        this.scrollToCurrentStep();
      }, 50);
    }
  }

  scrollToCurrentStep() {
    const element = document.getElementById(`step-${this.currentStep}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      setTimeout(() => {
        this.scrollToCurrentStep();
      }, 50);
    }
  }

  goToStep(step: number) {
    if (step <= this.currentStep) {
      this.currentStep = step;
    }
  }


  // Add these methods
  addTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
      event.target.value = '';
    }
    event.preventDefault();
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  handleBackspace(event: any) {
    if (event.target.value === '' && this.tags.length > 0) {
      this.removeTag(this.tags.length - 1);
    }
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.addProductService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  onCategoryChange(event: any) {
    const categoryId = event.target.value;
    if (categoryId) {
      this.addProductService.getSubCategoriesByCategoryId(+categoryId).subscribe({
        next: (res) => {
          this.subCategories = res;
          this.AddProductForm.get('subcat')?.reset();
        },
        error: (err) => {
          console.error('Failed to load subcategories', err);
          this.subCategories = [];
        }
      });
    } else {
      this.subCategories = [];
    }
  }

  images: any[] = Array(8).fill(null);

  handleFileInput(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // Basic image validation
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image (JPEG, PNG, WEBP)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      this.images[index] = {
        file: file,
        previewUrl: URL.createObjectURL(file)
      };
    }
  }

  canUpload(index: number): boolean {
    if (index === 0) return true;

    return !!this.images[index - 1];
  }

  triggerFileInput(index: number, isEnabled: boolean) {
    if (!isEnabled) return;

    const fileInput = document.getElementById('fileInput' + index) as HTMLElement;
    fileInput.click();
  }

  removeImage(index: number, event: MouseEvent) {
    event.stopPropagation();

    if (this.images[index]?.previewUrl) {
      URL.revokeObjectURL(this.images[index].previewUrl);
    }
    this.images[index] = null;

    for (let i = index + 1; i < this.images.length; i++) {
      if (this.images[i]?.previewUrl) {
        URL.revokeObjectURL(this.images[i].previewUrl);
      }
      this.images[i] = null;
    }
  }
}
