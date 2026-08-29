import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap, catchError, of, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  LucideUsers,
  LucideSearch,
  LucideEye,
  LucideUserCheck,
  LucideUserX,
  LucideTrash2,
  LucideX,
  LucideBuilding2,
  LucideUser,
  LucideHome,
  LucideAlertCircle,
  LucideChevronLeft,
  LucideChevronRight,
  LucideDynamicIcon,
} from '@lucide/angular';
import { UserService } from '../../_services/user.service';
import { Role, User } from '../../_models/user.model';

export type RoleFilter = 'TOUS' | 'CLIENT' | 'PROPRIETAIRE_PART' | 'AGENCE_IMMOBILIERE' | 'ADMIN';export type ExtendedUserAdmin = User & { annoncesCount?: number };

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideUsers,
    LucideSearch,
    LucideEye,
    LucideUserCheck,
    LucideUserX,
    LucideTrash2,
    LucideX,
    LucideBuilding2,
    LucideUser,
    LucideHome,
    LucideChevronLeft,
    LucideChevronRight,
    LucideAlertCircle,
    LucideDynamicIcon,
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  private userService = inject(UserService);

  // ÉTATS DE FILTRAGE ET PAGINATION
  selectedRoleFilter = signal<RoleFilter>('TOUS');
  searchQuery = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  isLoading = signal<boolean>(false);


  private debouncedSearch = toObservable(this.searchQuery).pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  private debouncedSearchSignal = toSignal(this.debouncedSearch, { initialValue: '' });

  // SIGNAL COMBINÉ DES PARAMÈTRES D'API (Inclut le rôle et la recherche)
  private queryParams = computed(() => ({
    role: this.selectedRoleFilter() === 'TOUS' ? undefined : (this.selectedRoleFilter() as Role),
    search: this.debouncedSearchSignal(),
    page: this.currentPage() - 1,
    size: this.pageSize(),
  }));

  // RECUPÉRATION AUTOMATIQUE VIA LE BACKEND
  private apiResponse = toSignal(
    toObservable(this.queryParams).pipe(
      tap(() => this.isLoading.set(true)),
      switchMap((params) =>
        this.userService.getUsers(params.role, params.search, params.page, params.size).pipe(
          catchError((err) => {
            console.error('Erreur lors du chargement:', err);
            return of({
              content: [],
              totalElements: 0,
              totalPages: 1,
              size: params.size,
              number: params.page,
            });
          }),
        ),
      ),
      tap(() => this.isLoading.set(false)),
    ),
  );

  // COMPTEURS STATISTIQUES (à ajouter dans la classe Users)
  countTotal = computed(() => this.totalElements());

  // DONNÉES CALCULÉES
  users = computed(() => (this.apiResponse()?.content ?? []) as ExtendedUserAdmin[]);
  totalElements = computed(() => this.apiResponse()?.totalElements ?? 0);
  totalPages = computed(() => this.apiResponse()?.totalPages ?? 1);

  // MODALES
  selectedUser = signal<ExtendedUserAdmin | null>(null);
  userToDelete = signal<ExtendedUserAdmin | null>(null);

  // NAVIGATION & FILTRES
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Retour à la première page lors d'une recherche
  }

  onRoleFilterChange(role: RoleFilter) {
    this.selectedRoleFilter.set(role);
    this.currentPage.set(1); // Retour à la première page lors du changement de filtre
  }

  // ACTIONS SUR LES UTILISATEURS
  toggleUserStatus(user: ExtendedUserAdmin) {
    const nextStatus = user.userStatut === 'ACTIF' ? 'SUSPENDU' : 'ACTIF';
    this.userService.updateUserStatut(user.id, nextStatus).subscribe({
      next: () => {
        // Force le rechargement du signal en touchant à la page courante
        this.currentPage.update((p) => p);
      },
      error: (err) => console.error('Erreur lors du changement de statut:', err),
    });
  }

  openDetails(user: ExtendedUserAdmin) {
    this.selectedUser.set(user);
  }

  closeDetails() {
    this.selectedUser.set(null);
  }

  openDeleteModal(user: ExtendedUserAdmin) {
    this.userToDelete.set(user);
  }

  closeDeleteModal() {
    this.userToDelete.set(null);
  }

  confirmDelete() {
    const user = this.userToDelete();
    if (user) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.currentPage.update((p) => p);
          if (this.selectedUser()?.id === user.id) {
            this.closeDetails();
          }
          this.closeDeleteModal();
        },
        error: (err) => console.error('Erreur lors de la suppression:', err),
      });
    }
  }
}
