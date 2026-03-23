import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
@Component({
  standalone:false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalPackages: 0,
    totalBookings: 0,
    pendingBookings: 0,
    revenue: 0
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error loading stats:', err)
    });
  }
}
