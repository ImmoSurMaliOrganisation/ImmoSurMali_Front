import { Routes } from '@angular/router';
import { PropertyList } from './client/components/property-list/property-list.component';
import { PropertyDetailsComponent } from './client/components/property-details.component/property-details.component';
import { AuthComponent } from './client/components/login/auth.component';
import { ProfileComponent } from './client/components/profile/profile.component';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'properties', component: PropertyList },
  { path: 'property/:id', component: PropertyDetailsComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'profile', component: ProfileComponent },
];
