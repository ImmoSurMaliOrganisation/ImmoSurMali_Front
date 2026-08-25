import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { StorageService } from '../storage/storage';
import { UserRole } from '../../models/user-role.enum';

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

// Interface correspondant au AuthResponseDTO renvoyé par Spring Boot[cite: 1]
export interface AuthResponse {
  token: string;
  tokenType?: string;
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storageService = inject(StorageService);

  private readonly API_URL = 'http://localhost:8081/api/v1/auth';

  // Keys constantes pour le storage
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';

  // Signals réactifs pour suivre l'état d'authentification
  currentUserRole = signal<string | null>(this.getRoleFromStorage());
  isAuthenticated = signal<boolean>(!!this.getToken());

  /**
   * Connexion unifiée vers l'API Spring Boot (POST /login)
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          this.saveSession(response.token, response.role);
        }
      }),
    );
  }

  /**
   * Enregistre le jeton et le rôle dans le storage puis met à jour les signals
   */
  saveSession(token: string, role: UserRole): void {
    this.storageService.setItem(this.TOKEN_KEY, token);
    this.storageService.setItem(this.ROLE_KEY, role);
    this.isAuthenticated.set(true);
    this.currentUserRole.set(role);
  }

  /**
   * Déconnexion globale de l'utilisateur
   */
  logout(): void {
    // 1. On récupère le rôle actuel avant de tout vider
    const currentRole = this.currentUserRole();

    // 2. Nettoyage du stockage local et réinitialisation des signals
    this.storageService.removeItem(this.TOKEN_KEY);
    this.storageService.removeItem(this.ROLE_KEY);
    this.isAuthenticated.set(false);
    this.currentUserRole.set(null);

    // 3. Redirection intelligente selon la situation / l'espace
    if (currentRole === UserRole.ADMIN) {
      this.router.navigate(['/admin/login']); // Redirection spécifique Back-Office
    } else {
      this.router.navigate(['/auth']); // Redirection pour les utilisateurs publics/clients
    }
  }

  getToken(): string | null {
    return this.storageService.getItem<string>(this.TOKEN_KEY);
  }

  getRoleFromStorage(): string | null {
    return this.storageService.getItem<string>(this.ROLE_KEY);
  }

  /**
   * Helper pour vérifier rapidement si l'utilisateur possède un rôle spécifique
   */
  hasRole(role: UserRole): boolean {
    return this.currentUserRole() === role;
  }
}
