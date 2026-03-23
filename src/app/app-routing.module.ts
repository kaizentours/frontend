import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { PackageDetailComponent } from './package-detail/package-detail.component';


import { WebsiteLayoutComponent } from './website-layout/website-layout.component';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  // Website routes - WITH header/footer
  {
    path: '',
    component: WebsiteLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutUsComponent },
      { path: 'contact', component: ContactUsComponent },
      { path: 'booking', component: BookingFormComponent },
      { path: 'packages/:id', component: PackageDetailComponent },
    ]
  },


  // Admin routes - WITHOUT header/footer
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
