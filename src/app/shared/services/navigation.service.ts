import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  // Gère l'onglet actif (home, favorites, search, profile, etc.)
  activeTab = signal<string>('home');
  private router = inject(Router);
  // Gère le mode d'affichage (grid ou map)
  viewMode = signal<'grid' | 'map'>('grid');

  constructor() {
    // Synchronisation automatique au chargement et au changement de route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.syncTabWithRoute(event.urlAfterRedirects);
      });
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);

    // Logique métier sur le viewMode
    if (tab === 'maps') {
      this.viewMode.set('map');
    } else if (tab === 'home' || tab === 'search' || tab === 'properties') {
      this.viewMode.set('grid');
    }
  }
  // Méthode pour basculer uniquement la vue (pour le bouton flottant par exemple)
  toggleViewMode() {
    this.viewMode.update((mode) => (mode === 'grid' ? 'map' : 'grid'));
  }
  private syncTabWithRoute(url: string) {
    if (url.includes('properties')) this.activeTab.set('home');
    else if (url.includes('auth')) this.activeTab.set('auth');
    else if (url.includes('profile')) this.activeTab.set('profile');
    // Ajoute d'autres conditions selon tes routes
  }
}
