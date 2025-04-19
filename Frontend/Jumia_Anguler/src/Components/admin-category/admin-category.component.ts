import { Component, OnInit } from '@angular/core';
import { AdminCategoryService, Category, SubCategory } from '../../Services/admin-category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  showUpdateModal: boolean = false;
  selectedCategoryId: number = 0;
  currentCategory: Category = this.createEmptyCategory();
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private categoryService: AdminCategoryService) {}

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

  openUpdateModal(category: Category): void {
    this.currentCategory = {
      id: category.id,
      name: category.name,
      subcategory: category.subcategory?.map(sub => ({
        subCatId: sub.subCatId || 0,
        subCatName: sub.subCatName || '',
        categoryName: sub.categoryName || category.name,
        categoryId: category.id   
      })) || [{
        subCatId: 0,
        subCatName: '',
        categoryName: category.name,
        categoryId: category.id
      }]
    };
    this.showUpdateModal = true;
    this.errorMessage = '';
  }

  saveCategory(): void {
    if (!this.currentCategory?.name?.trim()) {
      this.errorMessage = 'Category name is required';
      return;
    }
  
    const categoryToUpdate: Category = {
      id: this.currentCategory!.id,
      name: this.currentCategory!.name,
      subcategory: this.currentCategory.subcategory?.map(sub => ({
        subCatId: sub.subCatId || 0,
        subCatName: sub.subCatName || '',
        categoryName: sub.categoryName || this.currentCategory!.name,
        categoryId: this.currentCategory!.id
      })) || []
    };
    
    this.isLoading = true;
    this.categoryService.updateCategory(this.currentCategory.id, categoryToUpdate)
      .subscribe({
        next: () => {
          this.loadCategories();
          this.showUpdateModal = false;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to update category';
          this.isLoading = false;
        }
      });
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
