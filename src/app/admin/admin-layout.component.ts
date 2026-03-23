import { Component } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-admin-layout',
  templateUrl:'./admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  logout(): void {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  }
}
