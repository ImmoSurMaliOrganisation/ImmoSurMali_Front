import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Property } from '../../shared/models/property.model';
import { FilterSection } from '../filter-section/filter-section';
import { PropertyCard } from '../../shared/components/property-card/property-card.component';
import { SectionContainerComponent } from '../section-container/section-container.component';
import { forkJoin } from 'rxjs';
import { NavigationService } from '../../shared/services/navigation.service';
import { MapView } from '../map-view.component/map-view.component';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    FilterSection,
    PropertyCard,
    PropertyCard,
    FilterSection,
    SectionContainerComponent,
    MapView,
  ],
  templateUrl: './property-list.component.html',
})
export class PropertyList {
  scrollToPage(_t47: number, _t16: HTMLDivElement) {
    throw new Error('Method not implemented.');
  }
  private http = inject(HttpClient);
  properties = signal<Property[]>([]);
  recentProperties = signal<Property[]>([]);
  mostLikedProperties = signal<Property[]>([]);

  searchQuery = signal('');
  selectedCategory = signal<string>('All');

  maxPrice = signal<number>(1000000);
  minBeds = signal<number>(0);
  showAdvanced = signal(false);
  isLoading = signal(false);

  public navService: NavigationService = inject(NavigationService);

  // --- LOGIQUE DE FILTRAGE CENTRALISÉE ---
  private applyFilters(p: Property): boolean {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const price = this.maxPrice();
    const beds = this.minBeds();

    const matchesSearch =
      !query || p.title.toLowerCase().includes(query) || p.location.toLowerCase().includes(query);
    const matchesCategory = cat === 'All' || p.category === cat;
    const matchesPrice = p.price <= price;
    const matchesBeds = p.beds >= beds;

    return matchesSearch && matchesCategory && matchesPrice && matchesBeds;
  } // --- SIGNAUX CALCULÉS (RÉACTIFS) ---

  // 1. Filtrage pour la section Récents
  filteredRecent = computed(() => this.recentProperties().filter((p) => this.applyFilters(p)));

  // 2. Filtrage pour la section Populaires
  filteredPopular = computed(() => this.mostLikedProperties().filter((p) => this.applyFilters(p)));

  // 3. Filtrage pour le Catalogue complet
  filteredProperties = computed(() => this.properties().filter((p) => this.applyFilters(p)));


  allProperties = computed(() => [
  ...this.filteredRecent(),
  ...this.filteredPopular(),
  ...this.filteredProperties()
]);

  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  updatePrice(event: Event) {
    this.maxPrice.set(Number((event.target as HTMLInputElement).value));
  }

  hasActiveFilters = computed(() => {
    return (
      this.searchQuery().trim() !== '' ||
      this.selectedCategory() !== 'All' ||
      this.maxPrice() < 1000000 ||
      this.minBeds() > 0
    );
  });

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('All');
    this.maxPrice.set(1000000);
    this.minBeds.set(0);
  }
  setCategory(category: string) {
    this.selectedCategory.set(category);
  }

  constructor() {
    this.loadProperties();
  }
  // Méthode réutilisable
  getSkeletonCount(properties: any[]): number {
    const count = properties.length;
    // Si vide (chargement), on affiche 3 ou 4 pour remplir l'espace
    // Sinon on plafonne à 10
    return count > 0 ? Math.min(count, 10) : 5;
  }

  loadProperties() {
    this.isLoading.set(true);
    setTimeout(() => {
      forkJoin({
        recent: this.http.get<Property[]>('assets/data/recent_properties.json'),
        popular: this.http.get<Property[]>('assets/data/popular_properties.json'),
        all: this.http.get<Property[]>('assets/data/properties.json'),
      }).subscribe({
        next: (results) => {
          // Mise à jour de tes signaux respectifs
          this.recentProperties.set(results.recent);
          this.mostLikedProperties.set(results.popular);
          this.properties.set(results.all);

          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des données', err);
          this.isLoading.set(false);
        },
      });
    }, 1000);
  }
  // Logique favoris centralisée
  handleFavorite(property: any) {
    console.log(`Favorite toggled: ${property.title}`);
  }

  scroll(el: HTMLElement, distance: number) {
    el.scrollBy({
      left: distance,
      behavior: 'smooth',
    });
  }
}
