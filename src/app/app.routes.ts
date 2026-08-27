import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'proprio',
    loadChildren: () => import('./proprio/proprio.routes').then((m) => m.PROPRIO_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('./client/client.routes').then((m) => m.CLIENT_ROUTES),
  },
  
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
