import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PackagesListComponent } from './packages-list/packages-list.component';
import { PackageFormComponent } from './package-form/package-form.component';
import { BookingsListComponent } from './bookings-list/bookings-list.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'packages', component: PackagesListComponent },
      { path: 'packages/new', component: PackageFormComponent },
      { path: 'packages/edit/:id', component: PackageFormComponent },
      { path: 'bookings', component: BookingsListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
