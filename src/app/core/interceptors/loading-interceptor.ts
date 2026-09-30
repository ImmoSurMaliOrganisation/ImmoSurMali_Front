import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading/loading';
import { catchError, finalize, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const authService = inject(AuthService);

  // 1. Récupération du token d'authentification
  const token = localStorage.getItem('auth_token'); // Remplacez 'token' par votre clé si différente

  // 2. Si le token existe, cloner la requête et ajouter le header Authorization
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 3. Déclenche le chargement dès qu'une requête HTTP commence
  loadingService.show();

  return next(authReq).pipe(
    // 4. Intercepter les erreurs HTTP (comme l'expiration du token)
    catchError((error: HttpErrorResponse) => {
      // Si le token est expiré ou invalide (401 Non autorisé ou 403 Interdit)
      if (error.status === 401 || error.status === 403) {
        console.warn('Token expiré ou invalide. Nettoyage et redirection...');

        authService.logout(true);
      }

      return throwError(() => error);
    }),

    // 5. finalize() s'exécute systématiquement à la fin (Succès ou Erreur HTTP)
    finalize(() => {
      loadingService.hide();
    }),
  );
};
