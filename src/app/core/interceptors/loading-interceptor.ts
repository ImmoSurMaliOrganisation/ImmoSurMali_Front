import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading/loading';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
 const loadingService = inject(LoadingService);

// 1. Récupération du token d'authentification
  const token = localStorage.getItem('auth_token'); // Remplacez 'token' par votre clé si différente
  
  // 2. Si le token existe, cloner la requête et ajouter le header Authorization
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 3. Déclenche le chargement dès qu'une requête HTTP commence
  loadingService.show();

 return next(authReq).pipe(
    // 4. finalize() s'exécute systématiquement à la fin (Succès ou Erreur HTTP)
    finalize(() => {
      loadingService.hide();
    })
  );
};
