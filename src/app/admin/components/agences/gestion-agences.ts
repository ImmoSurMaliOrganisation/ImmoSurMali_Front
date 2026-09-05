import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgenceAdminService } from '../../_services/agence-admin.service';
import { RouterLink } from '@angular/router';

export type AgenceFilter = 'TOUTES' | 'EN_ATTENTE' | 'ACTIF' | 'REJETE' | 'SUSPENDU';

@Component({
  selector: 'app-gestion-agences',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gestion-agences.html',
  styleUrl: './gestion-agences.css',
})
export class GestionAgences implements OnInit {
  public agenceService = inject(AgenceAdminService);

  isLoading = signal<boolean>(false);

  // 👉 MODIFICATION ICI : On utilise directement le signal partagé du service
  agences = this.agenceService.agences;

  // États de filtrage et recherche
  selectedFilter = signal<AgenceFilter>('TOUTES');
  searchQuery = signal<string>('');

  // États de la pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(10); // Nombre d'éléments par page
  countTotal = this.agenceService.countTotal;  // Nombre total d'agences (mis à jour depuis le backend)

  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.chargerDonneesAgences();
  }

  chargerDonneesAgences() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // On passe la page (indexée à 0 pour Spring Boot) et la taille
    const pageIndex = this.currentPage() - 1;
    const statutFiltre = this.selectedFilter();
    const recherche = this.searchQuery();

    this.agenceService
      .chargerAgences(pageIndex, this.pageSize(), statutFiltre, recherche)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Erreur chargement agences:', err);
          this.errorMessage.set('Impossible de charger la liste des agences.');
          this.isLoading.set(false);
        },
      });
  }

  // 1. Filtrage local (si nécessaire, ou géré directement par le backend)
  filteredAgences = computed(() => {
    return this.agences(); // Les données sont déjà filtrées/paginées par le backend
  });

  // 2. Nombre total de pages basé sur le total elements du backend
  totalPages = computed(() => {
    const total = this.agenceService.totalElements();
    return Math.ceil(total / this.pageSize()) || 1;
  });
  

  mathMin = Math.min;

  // 3. Affichage direct des agences reçues pour la page active
  paginatedAgences = computed(() => {
    return this.agences();
  });

  changerFiltre(filter: AgenceFilter) {
    this.selectedFilter.set(filter);
    this.currentPage.set(1); // Retour à la page 1
    this.chargerDonneesAgences(); // Recharger depuis le back avec le filtre
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.chargerDonneesAgences(); // Recharger depuis le back avec la recherche
  }

  changerPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.chargerDonneesAgences(); // Charger la nouvelle page depuis le back
    }
  }
}
