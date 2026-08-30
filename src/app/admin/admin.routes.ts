import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminLayout } from './admin-layout/admin-layout';
import { Dashboard } from './components/dashboard/dashboard';
import { adminGuard } from '../core/guards/admin.guard';
import { Users } from './components/users/users';
import { GestionAgences } from './components/agences/gestion-agences';
import { AgenceDetails } from './components/agence-details/agence-details';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  // 2. Layout Administrateur qui englobe uniquement les pages protégées
  {
    path: '',
    component: AdminLayout,
    canActivate: [adminGuard], // Sécurise tout l'espace admin d'un coup
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: Users },
      { path: 'agences', component: GestionAgences },
      { path: 'agences/details/:id', component: AgenceDetails },
    ],
  },
];
