import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product-dashboard.component.html',
  styleUrl: './add-product-dashboard.component.css'
})
export class AddProductDashboardComponent {

  currentStep: number = 1;
    // Add these properties
    productDescription: string = '';
    tags: string[] = [];
    subCategories: any[] = [];

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

  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Fashion' },
    { id: 3, name: 'Home & Kitchen' },
    { id: 4, name: 'Beauty' },
    { id: 5, name: 'Sports' }
  ];

  onCategoryChange(event: any) {
    const categoryId = event.target.value;
    // Example - you would fetch these from your service
    if (categoryId === '1') { // Electronics
      this.subCategories = [
        { id: 11, name: 'Mobile Phones' },
        { id: 12, name: 'Laptops' },
        { id: 13, name: 'TVs' }
      ];
    } else if (categoryId === '2') { // Fashion
      this.subCategories = [
        { id: 21, name: 'Men' },
        { id: 22, name: 'Women' },
        { id: 23, name: 'Kids' }
      ];
    } else {
      this.subCategories = [];
    }
  }


  images: any[] = Array(8).fill(null);

  triggerFileInput(index: number) {
    const fileInput = document.getElementById('fileInput' + index) as HTMLElement;
    fileInput.click();
  }

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

  removeImage(index: number, event: MouseEvent) {
    event.stopPropagation();
    if (this.images[index]?.previewUrl) {
      URL.revokeObjectURL(this.images[index].previewUrl);
    }
    this.images[index] = null;
  }
}
