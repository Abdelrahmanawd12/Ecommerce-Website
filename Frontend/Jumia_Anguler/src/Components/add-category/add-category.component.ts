import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AdminCategoryService } from '../../Services/admin-category.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-category',
  imports: [   CommonModule, 
    ReactiveFormsModule, 
    MatIconModule, 
    MatStepperModule , MatSnackBarModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  errorMessage: string = '';
    categoryForm!: FormGroup;
    currentStep: number = 1;
    isNameExist: boolean = false;
    constructor(
      private fb: FormBuilder,
      private categoryService: AdminCategoryService,
      private router: Router,
      private snackBar: MatSnackBar
    ) {}
  
    ngOnInit(): void {
      this.categoryForm = this.fb.group({
        id: [0],
        name: ['', Validators.required],
        subcategories: this.fb.array([
          this.fb.group({
            subCatName: ['', Validators.required]
          })
        ])
      });

      
    }
  
    get subcategories() {
      return this.categoryForm.get('subcategories') as FormArray;
    }
  
    addSubCategory() {
      this.subcategories.push(
        this.fb.group({
          subCatId: [0],
          subCatName: ['', Validators.required],
          categoryName: [this.categoryForm.get('name')?.value || '']
        })
      );
    }
    
  
    removeSubCategory(index: number) {
      this.subcategories.removeAt(index);
    }
  
    nextStep() {
      if (this.currentStep === 1 && this.categoryForm.get('name')?.valid) {
        const name = this.categoryForm.get('name')?.value;
    
      
        this.subcategories.controls.forEach((sub) => {
          const group = sub as FormGroup; 
    
     
          if (!group.get('categoryName')) {
            group.addControl('categoryName', this.fb.control(name));
          } else {
            group.get('categoryName')?.setValue(name);
          }
    
         
          if (!group.get('subCatId')) {
            group.addControl('subCatId', this.fb.control(0));
          }
        });
    
        this.currentStep++;
      }
    }
    
    
  
    prevStep() {
      if (this.currentStep > 1) this.currentStep--;
    }
  
    onSubmit() {
      if (this.isNameExist) {
        return; 
      }
      if (this.categoryForm.valid) {
        const raw = this.categoryForm.value;
  
        const formattedCategory = {
          id: 0,
          name: raw.name,
          subcategory: raw.subcategories.map((sub: any) => ({
            subCatId: 0,
            subCatName: sub.subCatName,
            categoryName: raw.name
          }))
        };
  
        this.categoryService.addCategory(formattedCategory).subscribe({
          next: (res) => {
            console.log('Category added!', res);
            
           
            this.snackBar.open('Category added successfully!', 'Close', {
              duration: 3000, 
            });
  
          
            this.router.navigate(['admin/categories']);
          },
          error: (err) => {
            if (err.status === 409) { 
              this.isNameExist = true;
              this.errorMessage = err.error.message; 
            } else {
              this.snackBar.open('Error adding category', 'Close', { duration: 3000 });
            }
          }
        });
      }
    }
  }