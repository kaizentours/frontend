import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebsiteService } from '../services/website.service';

@Component({
  standalone:false,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  loading = false;
  message = '';
  messageType = '';

  constructor(
    private fb: FormBuilder,
    private websiteService: WebsiteService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  get f() { return this.contactForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;
    this.websiteService.submitContact(this.contactForm.value)
      .subscribe({
        next: (response: any) => {
          this.message = response.message || 'Message sent successfully!';
          this.messageType = 'success';
          this.contactForm.reset();
          this.submitted = false;
          this.loading = false;
        },
        error: (error) => {
          this.message = 'Error sending message. Please try again.';
          this.messageType = 'error';
          this.loading = false;
        }
      });
  }
}
