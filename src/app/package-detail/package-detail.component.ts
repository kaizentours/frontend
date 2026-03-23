import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsiteService } from '../services/website.service';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.scss']
})
export class PackageDetailComponent implements OnInit {
  package: any = null;
  loading = true;
  error = '';
  activeTab = 'overview';
  currentSlide = 0;
  autoSlideInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private websiteService: WebsiteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPackage(id);
    } else {
      this.error = 'Package not found';
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

loadPackage(id: string): void {
    this.websiteService.getPackage(id).subscribe({
      next: (data) => {
        this.package = data;
        this.loading = false;
        // Set hero banner background
        const heroOverlay = document.querySelector('.hero-overlay') as HTMLElement;
        if (heroOverlay && data.mainImage) {
          heroOverlay.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data.mainImage})`;
        }
        this.startAutoSlide();
      },
      error: (err) => {
        this.error = 'Package not found';
        this.loading = false;
        console.error('Error loading package:', err);
      }
    });
  }

  startAutoSlide(): void {
    if (this.package && this.package.galleryImages && this.package.galleryImages.length > 1) {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 4000);
    }
  }

  nextSlide(): void {
    if (this.package && this.package.galleryImages) {
      this.currentSlide = (this.currentSlide + 1) % this.package.galleryImages.length;
    }
  }

  prevSlide(): void {
    if (this.package && this.package.galleryImages) {
      this.currentSlide = this.currentSlide === 0 ? 
        this.package.galleryImages.length - 1 : this.currentSlide - 1;
    }
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  bookNow(): void {
    if (this.package) {
      this.router.navigate(['/booking'], { 
        queryParams: { packageId: this.package._id } 
      });
    }
  }
}

