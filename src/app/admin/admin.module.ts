import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminRoutingModule } from './admin-routing.module';
import { QuillModule } from 'ngx-quill';

import { LoginComponent } from './login/login.component';
import { PackageFormComponent } from './package-form/package-form.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminComponent } from './admin.component';
import { BookingsListComponent } from './bookings-list/bookings-list.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminRoutingModule,
    QuillModule.forRoot()
    
  ],
  declarations:[
    LoginComponent,
    AdminLayoutComponent,
    AdminComponent,
    BookingsListComponent,
    ContactsListComponent,
    DashboardComponent,
    PackageFormComponent
  ],
providers: [AuthGuard, AuthService]
})
export class AdminModule { }