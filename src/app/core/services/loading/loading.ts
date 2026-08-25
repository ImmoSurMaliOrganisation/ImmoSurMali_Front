import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private activeRequestsCount = 0;

  // Signal pour le loader global (ex: Barre de progression en haut de page)
  isLoading = signal<boolean>(false);

  /**
   * Utilisé par l'intercepteur HTTP pour les requêtes globales
   */
  show(): void {
    this.activeRequestsCount++;
    if (!this.isLoading()) {
      this.isLoading.set(true);
    }
  }

  hide(): void {
    this.activeRequestsCount--;
    if (this.activeRequestsCount <= 0) {
      this.activeRequestsCount = 0;
      this.isLoading.set(false);
    }
  }

  /**
   * Forcer l'arrêt du loader (utile en cas de réinitialisation d'état)
   */
  reset(): void {
    this.activeRequestsCount = 0;
    this.isLoading.set(false);
  }
}
