import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface AdminDTO {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  dateOfBirth: Date;
  createdAt: Date;
  gender: string;
}

export interface UpdatePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private baseUrl = 'https://localhost:7266/api/UserAdmin';

  constructor(private http: HttpClient, private router: Router) {}

  getAdminInfo(id: string): Observable<AdminDTO> {
    return this.http.get<AdminDTO>(`${this.baseUrl}/adminInfo`, {
      params: { id },
    });
  }

  editAdmin(id: string, updatedAdmin: AdminDTO): Observable<AdminDTO> {
    return this.http.put<AdminDTO>(`${this.baseUrl}/editAdmin`, updatedAdmin, {
      params: { id },
    });
  }

  updatePassword(id: string, passwordDto: UpdatePasswordDTO): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/updatePassword?id=${id}`,
      passwordDto,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}
