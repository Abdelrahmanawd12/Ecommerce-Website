import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Icategory } from '../../../Models/Icategory';
import { environment } from '../../../Environment/Environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  constructor(private httpclient:HttpClient) { }
  getAllSubcategories():Observable<Icategory[]>{
    return this.httpclient.get<Icategory[]>(`${environment.apiUrl}/SubCategory`)
  }
  getSubcategoryById(id:number):Observable<Icategory>{
    return this.httpclient.get<Icategory>(`${environment.apiUrl}/SubCategory/${id}`)
  }
  getSubCategoryByName(name:string):Observable<Icategory>{
    return this.httpclient.get<Icategory>(`${environment.apiUrl}/SubCategory/${name}`)
  }
}
