import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubCategory {
  subCatId?: number;
  subCatName: string;
  categoryName?: string;
  categoryId?: number;
}
export interface Category {
  id: number;
  name: string;
  subcategory?: SubCategory[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminCategoryService {
  private baseUrl = 'https://localhost:7266/api/admin/categories';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category);
  }

  updateCategory(id: number, category: Category): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
