import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-packages-list',
  templateUrl: './packages-list.component.html',
  styleUrls: ['./packages-list.component.scss']
})
export class PackagesListComponent implements OnInit {
  packages: any[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.adminService.getAllPackages().subscribe({
      next: (data) => this.packages = data,
      error: (err) => {
        console.error('Error loading packages:', err);
        if (err.status === 401) {
          this.router.navigate(['/admin/login']);
        }
      }
    });
  }

  addPackage(): void {
    this.router.navigate(['/admin/packages/new']);
  }

  editPackage(id: string): void {
    this.router.navigate(['/admin/packages/edit', id]);
  }

  deletePackage(id: string): void {
    if (confirm('Are you sure you want to delete this package?')) {
      this.adminService.deletePackage(id).subscribe({
        next: () => this.loadPackages(),
        error: (err) => alert('Error deleting package')
      });
    }
  }
}
