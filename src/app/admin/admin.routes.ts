import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminLayout } from './admin-layout/admin-layout';
import { Dashboard } from './components/dashboard/dashboard';
import { adminGuard } from '../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
 {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: Dashboard, canActivate: [adminGuard], }
    ]
  }
];