import { Component, signal, computed, ElementRef, ViewChild } from '@angular/core';
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
  // Signals de sélection et filtres
  selectedType = signal<string>('TOUS');
  selectedStatut = signal<string>('TOUS');
  searchQuery = signal<string>('');
  isFilterDrawerOpen = signal<boolean>(false);

  // Catégories avec compteurs
  propertyTypes = [
    { label: 'Tous les biens', value: 'TOUS', count: 12 },
    { label: 'Appartements', value: 'APPARTEMENT', count: 5 },
    { label: 'Maisons & Villas', value: 'MAISON', count: 3 },
    { label: 'Terrains', value: 'TERRAIN', count: 2 },
    { label: 'Immeubles', value: 'IMMEUBLE', count: 2 },
  ];

  // Source de données
  biens = signal<Bien[]>([
    {
      id: '1',
      titre: 'Appartement F3 Badalabougou',
      type: 'APPARTEMENT',
      statut: 'DISPONIBLE',
      prix: 150000,
      adresse: 'Badalabougou',
      ref: 'ISM-001',
    },
    {
      id: '2',
      titre: 'Villa Duplex ACI 2000',
      type: 'MAISON',
      statut: 'LOUE',
      prix: 450000,
      adresse: 'ACI 2000',
      ref: 'ISM-002',
    },
    {
      id: '3',
      titre: 'Terrain 500m² Sotuba',
      type: 'TERRAIN',
      statut: 'DISPONIBLE',
      prix: 25000000,
      adresse: 'Sotuba',
      ref: 'ISM-003',
    },
  ]);

  // Calcul réactif de la liste filtrée
  filteredBiens = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const type = this.selectedType();
    const statut = this.selectedStatut();

    return this.biens().filter((bien) => {
      const matchesQuery =
        !query ||
        bien.titre.toLowerCase().includes(query) ||
        bien.adresse.toLowerCase().includes(query) ||
        bien.ref.toLowerCase().includes(query);

      const matchesType = type === 'TOUS' || bien.type === type;
      const matchesStatut = statut === 'TOUS' || bien.statut === statut;

      return matchesQuery && matchesType && matchesStatut;
    });
  });

  // Indicateur de présence de filtres actifs
  hasActiveFilters = computed(() => {
    return this.searchQuery() !== '' || this.selectedStatut() !== 'TOUS';
  });

  // Actions
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
    // Auto-focus sur l'input au moment de l'ouverture
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
