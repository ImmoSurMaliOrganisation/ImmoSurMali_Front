import { Routes } from '@angular/router';
import { ProprioLayout } from './proprio-layout/proprio-layout';
import { PropioLogin } from './components/propio-login/propio-login';

export const PROPRIO_ROUTES: Routes = [
 {
    path: '',
    component: ProprioLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: PropioLogin  },
    ]
  }
];