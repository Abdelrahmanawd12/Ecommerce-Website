import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// تعريف الـ DTO المستخدم في Angular
export interface AdminDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:5001/api/admin'; // استبدلي هذا بالـ URL الخاص بـ API

  constructor(private http: HttpClient) { }

  // الحصول على جميع المستخدمين
  getAllUsers(): Observable<AdminDTO[]> {
    return this.http.get<AdminDTO[]>(`${this.apiUrl}/users`);
  }

  // الحصول على مستخدم بواسطة الـ ID
  getUserById(userId: string): Observable<AdminDTO> {
    return this.http.get<AdminDTO>(`${this.apiUrl}/users/${userId}`);
  }

  // حذف المستخدم
  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }
}
