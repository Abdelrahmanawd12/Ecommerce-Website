import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, AdminCategoryService } from '../../Services/admin-category.service';

@Component({
  selector: 'app-updatecategory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './updatecategory.component.html',
  styleUrl: './updatecategory.component.css'
})
export class UpdatecategoryComponent implements OnInit {

  currentCategory: Category | null = null;  // تعديل هنا لتجنب الوصول للـ undefined
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private categoryService: AdminCategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getCategoryById(id);
    } else {
      this.errorMessage = 'Invalid category ID';
    }
  }

  getCategoryById(id: number) {
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        if (category) {
          this.currentCategory = {
            id: category.id,
            name: category.name,
            subcategory: category.subcategory?.map(sub => ({
              subCatId: sub.subCatId,
              subCatName: sub.subCatName,
              categoryName: sub.categoryName,
              categoryId: sub.categoryId
            })) || []
          };
        } else {
          this.errorMessage = 'Category not found';
        }
      },
      error: (err) => {
        this.errorMessage = 'Error loading category';
        console.error(err);
      }
    });
  }

  onSave() {
    if (!this.currentCategory?.name?.trim()) {
      this.errorMessage = 'Category name is required';
      return;
    }
  
    if (this.currentCategory) {
     
      if (this.currentCategory.subcategory?.length) {
        this.currentCategory.subcategory.forEach(sub => {
          sub.categoryName = this?.currentCategory?.name;
        });
  
      this.categoryService.updateCategory(this.currentCategory.id, this.currentCategory)
        .subscribe({
          next: () => {
            this.router.navigate(['/admin/categories']);
          },
          error: (err) => { 
            this.errorMessage = 'Error saving category'; 
            console.error(err); 
          }
        });
    }
    }
  }
  

  trackBySubCategory(index: number, sub: any): number {
    return sub.subCatId ?? 0;
  }
}
