import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Private helper to get headers with auth token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  // ==================== Login ====================
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + "/admin/login", { email, password })
  }

  // ==================== PACKAGES ====================

  getAllPackages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/packages');
  }

  getPackage(id: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/packages/' + id, { headers: this.getAuthHeaders() });
  }

  createPackage(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/admin/packages', data, { headers: this.getAuthHeaders() });
  }

  updatePackage(id: string, data: any): Observable<any> {
    return this.http.put(this.apiUrl + '/admin/packages/' + id, data, { headers: this.getAuthHeaders() });
  }

  deletePackage(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/packages/' + id, { headers: this.getAuthHeaders() });
  }

  // ==================== BOOKINGS ====================

  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/admin/bookings', { headers: this.getAuthHeaders() });
  }

  updateBooking(id: string, data: any): Observable<any> {
    return this.http.put(this.apiUrl + '/admin/bookings/' + id, data, { headers: this.getAuthHeaders() });
  }

  // ==================== CONTACTS ====================

  getAllContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/admin/contacts', { headers: this.getAuthHeaders() });
  }

  // ==================== FILE UPLOADS ====================

  uploadFile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
    });
    formData.forEach((value, key) => {
      console.log(`FormData ${key}:`, value);
    });
    return this.http.post(this.apiUrl + '/files/upload?module=PACKAGE', formData, { headers });
  }

  uploadMultipleFiles(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
    });
    formData.forEach((value, key) => {
      console.log(`FormData ${key}:`, value);
    });
    return this.http.post(this.apiUrl + '/files/upload-multiple?module=PACKAGE', formData, { headers });
  }

  // File preview & info
  getFileById(fileId: string): Observable<any> {
    return this.http.get(this.apiUrl + `/files/${fileId}`);
  }

  // File direct URL for preview
  getFilePreviewUrl(fileId: string): string {
    return `${this.apiUrl}/files/${fileId}/serve`;
  }

  // ==================== DASHBOARD ====================

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/admin/dashboard-stats', { headers: this.getAuthHeaders() });
  }
}

