import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { UserRole } from '../models/user-role.enum';

export const proprioGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const role = authService.currentUserRole();
    if (role === UserRole.PROPRIETAIRE || role === UserRole.AGENCE) {
      router.navigate(['/pro/dashboard']);
      return false;
    }
  }
  return true;
};