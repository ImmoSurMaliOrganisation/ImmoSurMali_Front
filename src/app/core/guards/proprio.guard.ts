import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { UserRole } from '../models/user-role.enum';

export const proprioGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated();
  const role = authService.currentUserRole();

  // Si l'utilisateur est authentifié ET possède le bon rôle -> Autoriser l'accès
  if (isAuth && (role === UserRole.PROPRIETAIRE || role === UserRole.AGENCE)) {
    return true;
  }

  // Si non autorisé -> Rediriger vers la page de connexion
  return router.createUrlTree(['/proprio/login']);
};