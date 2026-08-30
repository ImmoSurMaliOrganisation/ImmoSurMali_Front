import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgenceAdminService } from '../../_services/agence-admin.service';
import { AgenceAdmin } from '../../_models/agence.model';
import { RouterLink } from '@angular/router';

export type AgenceFilter = 'TOUTES' | 'EN_ATTENTE' | 'VALIDE' | 'REJETE' | 'SUSPENDU';

@Component({
  selector: 'app-gestion-agences',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gestion-agences.html',
  styleUrl: './gestion-agences.css'
})
export class GestionAgences implements OnInit {
private agenceService = inject(AgenceAdminService);

  agences = signal<AgenceAdmin[]>([]);
  isLoading = signal<boolean>(false);
  
  // États de filtrage et recherche
  selectedFilter = signal<AgenceFilter>('TOUTES');
  searchQuery = signal<string>('');

  // États de la pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(10); // Nombre d'éléments par page

  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.chargerAgences();
  }

  chargerAgences() {
    this.isLoading.set(true);
    this.agenceService.getToutesLesAgences().subscribe({
      next: (data) => {
        this.agences.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement agences:', err);
        this.errorMessage.set('Impossible de charger la liste des agences.');
        this.isLoading.set(false);
      }
    });
  }

  // 1. Filtrage global (par statut et recherche textuelle)
  filteredAgences = computed(() => {
    const filter = this.selectedFilter();
    const query = this.searchQuery().toLowerCase().trim();

    return this.agences().filter(agence => {
      const matchFilter = filter === 'TOUTES' || agence.statut === filter;
      const matchSearch = !query || 
        agence.nomAgence.toLowerCase().includes(query) || 
        agence.email.toLowerCase().includes(query) || 
        agence.rccm.toLowerCase().includes(query) ||
        agence.adresse.toLowerCase().includes(query);

      return matchFilter && matchSearch;
    });
  });

  // 2. Nombre total de pages calculé automatiquement
  totalPages = computed(() => {
    const total = this.filteredAgences().length;
    return Math.ceil(total / this.pageSize()) || 1;
  });
mathMin = Math.min;
  // 3. Agences affichées uniquement pour la page active (découpage du tableau)
  paginatedAgences = computed(() => {
    const items = this.filteredAgences();
    const page = this.currentPage();
    const size = this.pageSize();
    
    const startIndex = (page - 1) * size;
    return items.slice(startIndex, startIndex + size);
  });

  changerFiltre(filter: AgenceFilter) {
    this.selectedFilter.set(filter);
    this.currentPage.set(1); // Retour à la première page lors d'un changement de filtre
  }

  // Réinitialiser la page quand on recherche du texte
  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  changerPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}