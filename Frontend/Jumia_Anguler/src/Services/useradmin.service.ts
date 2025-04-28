import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface AdminDTO {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  gender: string;
  dateOfBirth: Date;
  createdAt?: Date;
}

export interface UpdateAdminEmailDTO {
  email: string;
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private baseUrl = 'https://localhost:7266/api/UserAdmin'; 

  constructor(private http: HttpClient) {}

  getAdminById(id: string): Observable<AdminDTO> {
    return this.http.get<AdminDTO>(`${this.baseUrl}/getAdminById/${id}`);
  }

  editAdmin(id: string, adminDto: AdminDTO): Observable<AdminDTO> {

    return this.http.put<AdminDTO>(`${this.baseUrl}/editAdmin/${id}`, adminDto);
  }
  


changePassword(id: string, dto: ChangePasswordDTO): Observable<any> {
  return this.http.put(
    `${this.baseUrl}/changePassword/${id}`, 
    dto,
    {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  )
}

}
