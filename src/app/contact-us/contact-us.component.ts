import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebsiteService } from '../services/website.service';

@Component({
  standalone:false,
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html'
})
export class ContactUsComponent {
  contactForm!: FormGroup;
  submitted = false;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private websiteService: WebsiteService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: [''],
      message: ['', Validators.required]
    });
  }

  get f() { return this.contactForm.controls; }

  onSubmit(): void {
    if (this.contactForm.invalid) return;
    
    this.loading = true;
    this.websiteService.submitContact(this.contactForm.value).subscribe({
      next: () => { this.submitted = true; this.loading = false; },
      error: () => { this.error = 'Failed to send message'; this.loading = false; }
    });
  }
}
