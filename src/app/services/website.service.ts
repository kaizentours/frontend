import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class WebsiteService {
  private apiUrl = environment.apiUrl;

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
