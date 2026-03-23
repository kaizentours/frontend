import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebsiteService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // ==================== PACKAGES ====================
  
  getAllPackages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/packages');
  }

  getPackage(id: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/packages/' + id);
  }

  // ==================== BOOKINGS ====================
  
  submitBooking(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/bookings', data);
  }

  // ==================== CONTACT ====================
  
  submitContact(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/contact', data);
  }
}
