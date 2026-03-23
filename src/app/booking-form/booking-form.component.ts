import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WebsiteService } from '../services/website.service';

@Component({
  standalone:false,
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {
  packages: any[] = [];
  packagePreselected = false;
  bookingForm!: FormGroup;
  submitting = false;
  bookingSuccess = false;
  error = '';
  preselectedPackageId: string | null = null;

  constructor(
    private websiteService: WebsiteService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      packageId: ['', Validators.required],
      travelDate: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/) ]],
      adults: [1, [Validators.required, Validators.min(0)]],
      children: [0, [Validators.required, Validators.min(0)]]
    });

    this.loadPackages();

    // Check if packageId passed from package detail page
    this.route.queryParams.subscribe(params => {
      if (params['packageId']) {
        this.preselectedPackageId = params['packageId'];
        this.packagePreselected = true;
        this.bookingForm.patchValue({
          packageId: params['packageId']
        });
      }
    });
  }

  loadPackages(): void {
    this.websiteService.getAllPackages().subscribe({
      next: (data) => {
        this.packages = data;
      },
      error: (err) => {
        console.error('Error loading packages', err);
        this.error = 'Failed to load packages';
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      Object.keys(this.bookingForm.controls).forEach(key => {
        const control = this.bookingForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;

    const bookingData = {
      ...this.bookingForm.value,
      source: 'booking-form'
    };

    this.websiteService.submitBooking(bookingData).subscribe({
      next: (response) => {
        this.bookingSuccess = true;
        this.submitting = false;
      },
      error: (err) => {
        console.error('Booking error:', err);
        this.error = 'Booking failed. Please try again.';
        this.submitting = false;
      }
    });
  }

  resetForm(): void {
    this.bookingForm.reset();
    this.bookingSuccess = false;
    this.packagePreselected = false;
    this.preselectedPackageId = null;
  }

  get packageId() { return this.bookingForm.get('packageId'); }
  get travelDate() { return this.bookingForm.get('travelDate'); }
  get fullName() { return this.bookingForm.get('fullName'); }
  get email() { return this.bookingForm.get('email'); }
  get phone() { return this.bookingForm.get('phone'); }
  get adults() { return this.bookingForm.get('adults'); }
  get children() { return this.bookingForm.get('children'); }
}

