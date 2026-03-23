import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';

import { AdminService } from '../services/admin.service';

@Component({
  standalone:false,
  selector: 'app-package-form',
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.scss']
})
export class PackageFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  packageId = '';
  editorModules = {
    toolbar: [
      ['bold', 'italic'],
      ['underline', 'strike'],
      ['blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['clean']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      description: [''],
      mainImage: [''],
      galleryImages: this.fb.array([]),
      resources: this.fb.array([]),
      duration: ['', Validators.required],
      destination: ['', Validators.required],
      overviewHTML: [''],
      itineraryHTML: [''],
      howToBookHTML: [''],
      isActive: [true],
      tourDates: this.fb.array([])
    });

    this.packageId = this.route.snapshot.paramMap.get('id') || '';
    if (this.packageId) {
      this.isEditMode = true;
      this.loadPackage();
    }
  }


  get tourDatesArray(): FormArray {
    return this.form.get('tourDates') as FormArray;
  }

  get galleryImagesArray(): FormArray {
    return this.form.get('galleryImages') as FormArray;
  }

  get resourcesArray(): FormArray {
    return this.form.get('resources') as FormArray;
  }

  mainImageName = '';
  galleryImageNames: string[] = [];
  resourceNames: string[] = [];

  addDate(): void {
    this.tourDatesArray.push(this.fb.group({
      date: ['', Validators.required]
    }));
  }



  async onMainImageChange(event: any): Promise<void> {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0] as File;
      this.mainImageName = file.name;
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await this.adminService.uploadFile(formData).toPromise();
        const previewUrl = this.adminService.getFilePreviewUrl(response.file.fileID);
        this.form.patchValue({ mainImage: previewUrl });
        this.mainImageName = response.file.originalName;
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload main image');
      }
    }
  }

  async onGalleryImagesChange(event: any): Promise<void> {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files) as File[];
      
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      try {
        const response = await this.adminService.uploadMultipleFiles(formData).toPromise();
        const galleryArray = this.galleryImagesArray;
        response.files.forEach((file: any) => {
          const previewUrl = this.adminService.getFilePreviewUrl(file.fileID);
          galleryArray.push(this.fb.control(previewUrl));
          this.galleryImageNames.push(file.originalName);
        });
      } catch (error) {
        console.error('Gallery upload failed:', error);
        alert('Failed to upload gallery images');
      }
    }
  }

  async onResourcesChange(event: any): Promise<void> {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files) as File[];
      
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('module', 'PACKAGE');
      
      try {
        const response = await this.adminService.uploadMultipleFiles(formData).toPromise();
        const resourcesArray = this.resourcesArray;
        response.files.forEach((file: any) => {
          resourcesArray.push(this.fb.control(file.url));
          this.resourceNames.push(file.originalName);
        });
      } catch (error) {
        console.error('Resources upload failed:', error);
        alert('Failed to upload resources');
      }
    }
  }

  removeDate(index: number): void {
    this.tourDatesArray.removeAt(index);
  }

  removeGalleryImage(index: number): void {
    this.galleryImagesArray.removeAt(index);
  }

  removeResource(index: number): void {
    this.resourcesArray.removeAt(index);
  }

  getFileName(value: string): string {
    // Extract filename from base64 data URL or original file
    if (typeof value === 'string' && value.startsWith('data:')) {
      // Try to extract filename from content-disposition or use generic name
      return 'selected-file.' + value.split(';')[0].split('/')[1] || 'document.pdf';
    }
    return value.split('/').pop() || 'Unknown file';
  }

  loadPackage(): void {
    this.adminService.getPackage(this.packageId)
      .subscribe(pkg => {
        this.form.patchValue({
          name: pkg.name,
          shortDescription: pkg.shortDescription || '',
          description: pkg.description || '',
          mainImage: pkg.mainImage || '',
          duration: pkg.duration,
          destination: pkg.destination,
          overviewHTML: pkg.overviewHTML || '',
          itineraryHTML: pkg.itineraryHTML || '',
          howToBookHTML: pkg.howToBookHTML || '',
          isActive: pkg.isActive
        });

        // Load gallery images
        if (pkg.galleryImages) {
          pkg.galleryImages.forEach((img: string) => {
            this.galleryImagesArray.push(this.fb.control(img));
          });
        }

        // Load resources
        if (pkg.resources) {
          pkg.resources.forEach((res: string) => {
            this.resourcesArray.push(this.fb.control(res));
          });
        }

        // Load tour dates
        if (pkg.tourDates) {
          pkg.tourDates.forEach((d: any) => {
            this.tourDatesArray.push(this.fb.group({
              date: [new Date(d.date).toISOString().split('T')[0]],
              status: [d.status || 'available']
            }));
          });
        }
      });
  }

  onSubmit(): void {
    const formData = this.form.value;

    // Handle tourDates
    let tourDatesArray: any[] = [];
    if (formData.tourDates && Array.isArray(formData.tourDates)) {
      tourDatesArray = formData.tourDates.map((d: any) => ({
        date: d.date,
        status: d.status || 'available'
      }));
    }

    const packageData = {
      name: formData.name,
      shortDescription: formData.shortDescription,
      description: formData.description,
      mainImage: formData.mainImage || '',
      galleryImages: formData.galleryImages || [],
      resources: formData.resources || [],
      duration: formData.duration,
      destination: formData.destination,
      overviewHTML: formData.overviewHTML,
      itineraryHTML: formData.itineraryHTML,
      howToBookHTML: formData.howToBookHTML,
      tourDates: tourDatesArray,
      isActive: formData.isActive || false
    };

    const apiCall = this.isEditMode
      ? this.adminService.updatePackage(this.packageId, packageData)
      : this.adminService.createPackage(packageData);

    apiCall.subscribe({
      next: () => {
        alert('Package saved successfully!');
        this.router.navigate(['/admin/packages']);
      },
      error: (err) => {
        console.error('Error saving package:', err);
        alert('Error saving package: ' + (err.message || 'Unknown error'));
      }
    });
  }
}

