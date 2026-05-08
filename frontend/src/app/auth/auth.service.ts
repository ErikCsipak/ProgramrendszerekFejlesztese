import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../shared/models/user.model';
import { environment } from '../../environments/environment';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return new Observable(observer => {
      this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
        .subscribe({
          next: (response) => {
            // Some backends return the token as `token` and some as `accessToken`.
            // Accept either and store a normalized `token` value.
            const anyResp = response as any;
            const tokenValue: string | null = anyResp?.token ?? anyResp?.accessToken ?? null;
            if (tokenValue) {
              localStorage.setItem('token', tokenValue as string);
            } else {
              // Ensure we don't store literal 'null'/'undefined' strings
              localStorage.removeItem('token');
            }
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
            observer.next(response);
            observer.complete();
          },
          error: (error) => observer.error(error)
        });
    });
  }

  register(email: string, password: string, fullName: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, {
      email,
      password,
      fullName
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  /**
   * Call backend logout endpoint (no-op for stateless JWT) and clear local state.
   */
  logoutRequest(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => this.logout())
    );
  }

  getToken(): string | null {
    const t = localStorage.getItem('token');
    if (!t) return null;
    // Avoid returning literal strings used by some storage mistakes
    if (t === 'null' || t === 'undefined') return null;
    return t;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Failed to parse user from storage', e);
      }
    }
  }

  validateToken(): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/validate`, {});
  }
}
