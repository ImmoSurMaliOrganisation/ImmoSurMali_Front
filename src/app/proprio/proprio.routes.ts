import { Routes } from '@angular/router';
import { ProprioLayout } from './proprio-layout/proprio-layout';
import { PropioLogin } from './components/propio-login/propio-login';
import { proprioGuard } from '../core/guards/proprio.guard';
import { ProprioDashboard } from './components/dashboard/proprio-dashboard';
import { ProprietaireBiens } from './components/proprietaire-biens/proprietaire-biens';

export const PROPRIO_ROUTES: Routes = [
  { path: 'login', component: PropioLogin },
  {
    path: '',
    canActivate: [proprioGuard],
    component: ProprioLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ProprioDashboard },
      { path: 'biens', component: ProprietaireBiens },
    ],
  },
];
