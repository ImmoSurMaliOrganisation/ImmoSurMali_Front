import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading/loading';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
 const loadingService = inject(LoadingService);

  // 1. Déclenche le chargement dès qu'une requête HTTP commence
  loadingService.show();

  return next(req).pipe(
    // 2. finalize() s'exécute systématiquement à la fin (Succès ou Erreur HTTP 400/401/500)
    finalize(() => {
      loadingService.hide();
    })
  );
};
