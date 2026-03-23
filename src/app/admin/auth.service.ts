import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminService } from './services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private adminService: AdminService) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  login(email: string, password: string): Observable<any> {
    return this.adminService.login(email, password)
      .pipe(tap((response: any) => {
        if (response.token) {
          localStorage.setItem('adminToken', response.token);
          localStorage.setItem('adminEmail', response.admin?.email || '');
          this.loggedIn.next(true);
        }
      }));
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    this.loggedIn.next(false);
  }

  // Get headers with token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
