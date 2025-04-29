import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../Environment/Environment.prod';
import { Isubcategory } from '../../Models/Category';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  constructor(private httpclient:HttpClient) { }
  getAllSubcategories():Observable<Isubcategory[]>{
    return this.httpclient.get<Isubcategory[]>(`${environment.apiUrl}/SubCategory`)
  }
  getSubcategoryById(id:number):Observable<Isubcategory>{
    return this.httpclient.get<Isubcategory>(`${environment.apiUrl}/SubCategory/${id}`)
  }
  getSubCategoryByName(name:string):Observable<Isubcategory>{
    return this.httpclient.get<Isubcategory>(`${environment.apiUrl}/SubCategory/${name}`)
  }



}
