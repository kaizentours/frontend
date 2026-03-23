import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebsiteService } from '../services/website.service';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  packages: any[] = [];
  loading = true;

  constructor(
    private websiteService: WebsiteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.websiteService.getAllPackages().subscribe({
      next: (data) => {
        this.packages = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading packages:', err);
        this.loading = false;
      }
    });
  }

  viewPackage(id: string): void {
    this.router.navigate(['/packages', id]);
  }
}

