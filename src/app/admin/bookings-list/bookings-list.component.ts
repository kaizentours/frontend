import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  standalone:false,
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.scss']
})
export class BookingsListComponent implements OnInit {
  bookings: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.adminService.getAllBookings().subscribe({
      next: (data) => this.bookings = data,
      error: (err) => console.error('Error loading bookings:', err)
    });
  }

  updateStatus(id: string, event: any): void {
    const status = event.target.value;
    this.adminService.updateBooking(id, status).subscribe({
      next: () => this.loadBookings(),
      error: (err) => alert('Error updating status')
    });
  }
}
