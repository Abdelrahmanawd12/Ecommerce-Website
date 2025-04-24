import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminCategoryService, Category, SubCategory } from '../../Services/admin-category.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, FormsModule ,RouterModule,ReactiveFormsModule ],  
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchQuery: string = '';
  sortOption: string = 'name-asc';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  showDeleteModal: boolean = false;
  showAddSubcategoryModal: boolean = false; 
  selectedCategoryId: number = 0;
  selectedCategoryName: string = ''; 
  currentCategory: Category = this.createEmptyCategory();
  isLoading: boolean = false;
  errorMessage: string = '';
  form: FormGroup;
  constructor(  private fb: FormBuilder,
    private adminCategoryService: AdminCategoryService,
    private categoryService: AdminCategoryService) {
      this.form = this.fb.group({
        subCatName: ['', [Validators.required]],
        subCatId: [0, [Validators.required]],
        categoryName: ''
      });
    }

  ngOnInit(): void {
    this.loadCategories();
  }

  private createEmptyCategory(): Category {
    return {
      id: 0,
      name: '',
      subcategory: [{
        subCatId: 0,
        subCatName: '',
        categoryName: ''
      }]
    };
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = [...data];
        this.calculateTotalPages();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load categories';
        this.isLoading = false;
      }
    });
  }


  showAddSubcategory(categoryId: number, categoryName: string): void {
    this.selectedCategoryId = categoryId;
    this.selectedCategoryName = categoryName;
  
 
    this.form.patchValue({
      
      categoryName: categoryName 
    });
  
    this.showAddSubcategoryModal = true;
  }
  

  closeAddSubcategoryModal(): void {
    this.showAddSubcategoryModal = false; 
  }

 
  filterCategories(): void {
    let result = this.categories;
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter((category: Category) => 
        category.name.toLowerCase().includes(query) ||
        (category.subcategory?.some((sub: SubCategory) => 
          sub.subCatName.toLowerCase().includes(query)
        ))
      );
    }
    
    this.sortCategories(result);
    this.filteredCategories = result;
    this.calculateTotalPages();
    this.currentPage = 1;
  }

  sortCategories(categories?: Category[]): void {
    const data = categories || this.filteredCategories;
    
    switch (this.sortOption) {
      case 'name-asc':
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        data.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'id-asc':
        data.sort((a, b) => (a.id - b.id));
        break;
      case 'id-desc':
        data.sort((a, b) => (b.id - a.id));
        break;
    }
    
    if (!categories) {
      this.filteredCategories = [...data];
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage) || 1;
  }

  getPaginatedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCategories.slice(startIndex, startIndex + this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }


  @Input() categoryId: number = 0; 
  @Input() categoryName: string = ''; 
  @Output() closeModal = new EventEmitter<void>(); 

 


  submit(): void {
    if (this.form.valid) {
      const subCategory = {
        subCatId: this.form.value.subCatId || 0,
        subCatName: this.form.value.subCatName,
        categoryName: this.selectedCategoryName
      };
  
      this.categoryService.addSubcategory(subCategory).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `"${subCategory.subCatName}" was added successfully`,
            confirmButtonColor: '#ff6700',
            timer: 3000
          });
          this.loadCategories();
          this.closeAddSubcategoryModal();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add subcategory',
            confirmButtonColor: '#ff6700'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Data',
        text: 'Please fill all required fields',
        confirmButtonColor: '#ff6700'
      });
    }
  }
  

  cancel() {
    this.closeModal.emit();
  }




  confirmDelete(id: number): void {
    this.selectedCategoryId = id;
    this.showDeleteModal = true;
  }

  deleteCategory(): void {
    this.isLoading = true;
    this.categoryService.deleteCategory(this.selectedCategoryId).subscribe({
      next: () => {
        this.loadCategories();
        this.showDeleteModal = false;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete category';
        this.isLoading = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  trackBySubCategory(index: number, sub: SubCategory): number {
    return sub.subCatId ?? 0; 
  }
}
