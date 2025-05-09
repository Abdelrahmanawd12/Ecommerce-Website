import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../Environment/Environment.prod';
import { Icategory, Isubcategory } from '../../Models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _httpClient:HttpClient) { }

getAllCategories():Observable<Icategory[]>{
  return this._httpClient.get<Icategory[]>(`${environment.apiUrl}/Category`)
}
getCategoryById(id:number):Observable<Icategory>{
  return this._httpClient.get<Icategory>(`${environment.apiUrl}/Category/${id}`)
}
getSubcategoriesByCategoryId(categoryId: number, page: number, pageSize: number): Observable<any> {
  return this._httpClient.get(`${environment.apiUrl}/Category/${categoryId}/subcategories?page=${page}&pageSize=${pageSize}`);
}

}

