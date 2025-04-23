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
}

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private baseUrl = 'https://localhost:port/api/UserAdmin'; 

  constructor(private http: HttpClient) {}

  getAdminById(id: string): Observable<AdminDTO> {
    return this.http.get<AdminDTO>(`${this.baseUrl}/getAdminById/${id}`);
  }

  editAdmin(id: string, adminDto: AdminDTO): Observable<AdminDTO> {
    return this.http.put<AdminDTO>(`${this.baseUrl}/editAdmin?id=${id}`, adminDto);
  }

  updateAdminEmail(id: string, emailDto: UpdateAdminEmailDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/editAdminEmail?id=${id}`, emailDto);
  }

  changePassword(id: string, passwordDto: ChangePasswordDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/changePassword?id=${id}`, passwordDto);
  }
}
