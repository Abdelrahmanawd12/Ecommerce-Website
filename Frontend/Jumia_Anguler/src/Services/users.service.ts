import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  gender?: string;
  dateOfBirth?: Date;
}
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = 'https://localhost:7266/api/admin/users'; 

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AdminDTO[]> {
    return this.http.get<AdminDTO[]>(this.baseUrl);
  }

  getUserById(id: string): Observable<AdminDTO> {
    return this.http.get<AdminDTO>(`${this.baseUrl}/${id}`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  addUser(user: AdminDTO): Observable<AdminDTO> {
    const url = 'https://localhost:7266/api/admin/add-user';
    return this.http.post<AdminDTO>(url, user);
  }

  updateUser(user: AdminDTO): Observable<any> {
    const url = 'https://localhost:7266/api/admin/update-user';
    return this.http.put(url, user);
  }
}
