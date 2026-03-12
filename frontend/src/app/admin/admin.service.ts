import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/admin/users/${userId}`);
  }

  createUser(user: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/users`, user);
  }

  updateUser(userId: number, user: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/admin/users/${userId}`, user);
  }
}
