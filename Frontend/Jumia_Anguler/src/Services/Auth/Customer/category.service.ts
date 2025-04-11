import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Icategory } from '../../../Models/Icategory';
import { environment } from '../../../Environment/Environment.prod';

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
}
