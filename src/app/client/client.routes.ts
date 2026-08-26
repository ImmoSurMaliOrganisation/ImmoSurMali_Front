import { Routes } from '@angular/router';
import { clientGuard } from '../core/guards/client.guard';

export const CLIENT_ROUTES: Routes = [
 {
    path: '',
    children: [
      { path: '', redirectTo: 'auth', pathMatch: 'full' },
      {
        path: 'auth',
        loadComponent: () =>
          import('./components/auth/auth.component').then((m) => m.AuthComponent),
      },
      {
        path: 'profile',
        canActivate: [clientGuard],
        loadComponent: () =>
          import('./components/profile/profile.component').then((m) => m.ProfileComponent),
      },
      // {
      //   path: 'properties',
      //   loadComponent: () =>
      //     import('./components/property-list/property-list.component').then((m) => m.PropertyList),
      // },
      // {
      //   path: 'property/:id',
      //   loadComponent: () =>
      //     import('./components/property-details/property-details.component').then((m) => m.PropertyDetailsComponent),
      // },
    ],
  },
];
