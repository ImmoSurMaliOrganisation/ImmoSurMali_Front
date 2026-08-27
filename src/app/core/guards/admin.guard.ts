import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { UserRole } from '../models/user-role.enum';

export const adminGuard: CanActivateFn = (route, state) => {
const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifie si l'utilisateur est authentifié et possède le rôle ADMIN
  const isAuth = authService.isAuthenticated();
  const isAdmin = authService.hasRole(UserRole.ADMIN);

  if (isAuth && isAdmin) {
    return true;
  }

  // Redirection vers le login admin si non autorisé
  return router.createUrlTree(['/admin/login']);
};