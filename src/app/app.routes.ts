import { Routes } from '@angular/router';
import { PropertyList } from './components/property-list/property-list.component';
import { PropertyDetailsComponent } from './components/property-details.component/property-details.component';
import { AuthComponent } from './components/login/auth.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'properties', component: PropertyList },
  { path: 'property/:id', component: PropertyDetailsComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'profile', component: ProfileComponent },
];
