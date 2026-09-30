import { Component, signal, computed, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucidePlusCircle,
  LucideBuilding2,
  LucideSearch,
  LucideX,
  LucideSlidersHorizontal,
} from '@lucide/angular';
import { FormsModule } from '@angular/forms';
import { BienService } from '../../../core/services/bien.service';
import { BienCardComponent } from '../bien-card/bien-card.component';
import { environment } from '../../../../environments/environment';

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
  imports: [
    CommonModule,
    RouterLink,
    LucidePlusCircle,
    FormsModule,
    LucideBuilding2,
    LucideSearch,
    LucideX,
    LucideSlidersHorizontal,
    BienCardComponent,
  ],
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

  // 1. Compteurs de statut dynamiques (qui tiennent compte du type de bien sélectionné)
  countTous = computed(() => {
    const type = this.selectedType();
    const list = this.biens();
    return type === 'TOUS' ? list.length : list.filter((b) => b.type === type).length;
  });

  countDisponibles = computed(() => {
    const type = this.selectedType();
    const list = this.biens();
    return list.filter((b) => b.statut === 'DISPONIBLE' && (type === 'TOUS' || b.type === type))
      .length;
  });

  countLoues = computed(() => {
    const type = this.selectedType();
    const list = this.biens();
    return list.filter((b) => b.statut === 'LOUE' && (type === 'TOUS' || b.type === type)).length;
  });

  // 2. Compteurs de types dynamiques (qui tiennent compte du statut sélectionné)
  propertyTypes = [
    {
      label: 'Tous les biens',
      value: 'TOUS',
      count: computed(() => {
        const statut = this.selectedStatut();
        const list = this.biens();
        return statut === 'TOUS' ? list.length : list.filter((b) => b.statut === statut).length;
      }),
    },
    {
      label: 'Appartements',
      value: 'APPARTEMENT',
      count: computed(() => {
        const statut = this.selectedStatut();
        const list = this.biens();
        return list.filter(
          (b) => b.type === 'APPARTEMENT' && (statut === 'TOUS' || b.statut === statut),
        ).length;
      }),
    },
    {
      label: 'Maisons & Villas',
      value: 'MAISON',
      count: computed(() => {
        const statut = this.selectedStatut();
        const list = this.biens();
        return list.filter((b) => b.type === 'MAISON' && (statut === 'TOUS' || b.statut === statut))
          .length;
      }),
    },
    {
      label: 'Terrains',
      value: 'TERRAIN',
      count: computed(() => {
        const statut = this.selectedStatut();
        const list = this.biens();
        return list.filter(
          (b) => b.type === 'TERRAIN' && (statut === 'TOUS' || b.statut === statut),
        ).length;
      }),
    },
    {
      label: 'Immeubles',
      value: 'IMMEUBLE',
      count: computed(() => {
        const statut = this.selectedStatut();
        const list = this.biens();
        return list.filter(
          (b) => b.type === 'IMMEUBLE' && (statut === 'TOUS' || b.statut === statut),
        ).length;
      }),
    },
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
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des biens :', err);
        this.isLoading.set(false);
      },
    });
  }

  getMainImageUrl(bien: any): string | null {
    if (!bien.medias || bien.medias.length === 0) return null;
    const principal = bien.medias.find((m: any) => m.estPrincipal);
    const media = principal ? principal : bien.medias[0];

    if (!media.url) return null;

    if (media.url.startsWith('/uploads')) {
      return `${environment.mediaUrl}${media.url}`;
    }
    return media.url;
  }

  // Calcul réactif de la liste filtrée
  filteredBiens = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const type = this.selectedType();
    const statut = this.selectedStatut();
    const list = this.biens();

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

  hasActiveFilters = computed(() => {
    return (
      this.searchQuery() !== '' ||
      this.selectedStatut() !== 'TOUS' ||
      this.selectedType() !== 'TOUS'
    );
  });

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  toggleFilterDrawer(): void {
    this.isFilterDrawerOpen.update((open) => !open);
  }

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
    this.selectedType.set('TOUS');
  }

  onSelectBien(bien: any): void {
    console.log(bien);
  }
}
