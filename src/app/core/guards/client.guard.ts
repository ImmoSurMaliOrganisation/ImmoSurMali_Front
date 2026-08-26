import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/user-role.enum';
import { AuthService } from '../services/auth/auth';

export const clientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated();
  const isClient = authService.hasRole(UserRole.CLIENT);

  if (isAuth && isClient) {
    return true;
  }

  // Redirection vers la page d'authentification si non autorisé
  return router.createUrlTree(['/auth']);
};