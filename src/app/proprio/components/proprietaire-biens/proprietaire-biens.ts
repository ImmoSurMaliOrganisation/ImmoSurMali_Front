import { Component, signal, computed, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucidePlusCircle,
  LucideBuilding,
  LucideHome,
  LucideTrees,
  LucideBuilding2,
} from '@lucide/angular';
import { FormsModule } from '@angular/forms';
import { BienService } from '../../../core/services/bien.service';

export interface Bien {
  id: string;
  titre: string;
  type: 'APPARTEMENT' | 'MAISON' | 'TERRAIN' | 'IMMEUBLE';
  statut: 'DISPONIBLE' | 'LOUE' | 'EN_ATTENTE';
  prix: number;
  adresse: string;
  ref: string;
}

@Component({
  selector: 'app-proprietaire-biens',
  standalone: true,
  imports: [CommonModule, RouterLink, LucidePlusCircle, FormsModule],
  templateUrl: './proprietaire-biens.html',
})
export class ProprietaireBiens {
  private bienService = inject(BienService);

  // Signals de sélection et filtres
  selectedType = signal<string>('TOUS');
  selectedStatut = signal<string>('TOUS');
  searchQuery = signal<string>('');
  isFilterDrawerOpen = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  // Signal pour stocker les biens de manière réactive
  biens = signal<any[]>([]);

// Catégories avec compteurs (peuvent aussi être calculés dynamiquement si besoin)
  propertyTypes = [
    { label: 'Tous les biens', value: 'TOUS', count: 0 },
    { label: 'Appartements', value: 'APPARTEMENT', count: 0 },
    { label: 'Maisons & Villas', value: 'MAISON', count: 0 },
    { label: 'Terrains', value: 'TERRAIN', count: 0 },
    { label: 'Immeubles', value: 'IMMEUBLE', count: 0 },
  ];

  ngOnInit(): void {
    this.chargerBiens();
  }

  chargerBiens(): void {
    this.isLoading.set(true);
    this.bienService.getTousLesBiens().subscribe({
      next: (data) => {
        this.biens.set(data);
        this.isLoading.set(false);
        // Optionnel : Mettre à jour les compteurs dynamiquement ici
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des biens :', err);
        this.isLoading.set(false);
      }
    });
  }

  // Calcul réactif de la liste filtrée (Attention : biens() est maintenant un Signal, donc on l'appelle avec des parenthèses)
  filteredBiens = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const type = this.selectedType();
    const statut = this.selectedStatut();
    const list = this.biens(); // Appel du signal biens

    return list.filter((bien) => {
      const matchesQuery =
        !query ||
        bien.titre?.toLowerCase().includes(query) ||
        bien.adresse?.toLowerCase().includes(query) ||
        bien.ref?.toLowerCase().includes(query);

      const matchesType = type === 'TOUS' || bien.type === type;
      const matchesStatut = statut === 'TOUS' || bien.statut === statut;

      return matchesQuery && matchesType && matchesStatut;
    });
  });

  // Indicateur de présence de filtres actifs

  hasActiveFilters = computed(() => {
    return this.searchQuery() !== '' || this.selectedStatut() !== 'TOUS';
  });

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  toggleFilterDrawer(): void {
    this.isFilterDrawerOpen.update((open) => !open);
  }
  // Signals pour l'overlay mobile
  isSearchOverlayOpen = signal<boolean>(false);
  @ViewChild('mobileSearchInput') mobileSearchInput?: ElementRef<HTMLInputElement>;

  openSearchOverlay(): void {
    this.isSearchOverlayOpen.set(true);
    setTimeout(() => {
      this.mobileSearchInput?.nativeElement.focus();
    }, 100);
  }

  closeSearchOverlay(): void {
    this.isSearchOverlayOpen.set(false);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedStatut.set('TOUS');
  }
}
