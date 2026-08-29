import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { StorageService } from '../storage/storage';
import { UserRole } from '../../models/user-role.enum';
import { environment } from '../../../../environments/environment';

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  token: string;
  tokenType?: string;
  email: string;
  role: UserRole;
  nom?: string; // Optionnel en attendant l'API
}

export interface RegisterClientRequest {
  nom: string;
  email: string;
  motDePasse: string;
  telephone: string;
}

// Interface locale pour typer le Signal currentUser
export interface UserInfo {
  nom: string;
  email: string;
  role: UserRole | string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storageService = inject(StorageService);

  private readonly API_URL = `${environment.apiUrl}/v1/auth`;

  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly USER_INFO_KEY = 'user_info';

  // Signals réactifs
  currentUserRole = signal<string | null>(this.getRoleFromStorage());
  isAuthenticated = signal<boolean>(!!this.getToken());

  // Signal currentUser initialisé depuis le Storage ou null
  currentUser = signal<UserInfo | null>(this.getUserFromStorage());

  /**
   * Connexion unifiée vers l'API
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          // Simulation d'infos utilisateur en attendant l'endpoint /me du backend
          const userData: UserInfo = {
            nom: response.nom || response.email.split('@')[0],
            email: response.email,
            role: response.role,
          };
          this.saveSession(response.token, response.role, userData);
        }
      }),
    );
  }

  /**
   * Inscription d'un nouveau client
   */
  registerClient(data: RegisterClientRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register/client`, data).pipe(
      tap((response) => {
        if (response && response.token) {
          const userData: UserInfo = {
            nom: data.nom,
            email: response.email,
            role: response.role,
          };
          this.saveSession(response.token, response.role, userData);
        }
      }),
    );
  }

  registerAgence(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/v1/auth/register/agence`, formData);
  }

  registerProprietaire(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/v1/auth/register/proprietaire`,
      data,
    );
  }

  /**
   * Sauvegarde la session et met à jour les Signals
   */
  saveSession(token: string, role: UserRole, user?: UserInfo): void {
    this.storageService.setItem(this.TOKEN_KEY, token);
    this.storageService.setItem(this.ROLE_KEY, role);

    // Fallback si pas de données utilisateur transmises
    const userInfo: UserInfo = user || {
      nom: 'Utilisateur',
      email: '',
      role: role,
    };

    this.storageService.setItem(this.USER_INFO_KEY, userInfo);

    // Mise à jour des Signals
    this.isAuthenticated.set(true);
    this.currentUserRole.set(role);
    this.currentUser.set(userInfo);
  }

  /**
   * Déconnexion globale
   */
  logout(): void {
    const currentRole = this.currentUserRole();

    // Nettoyage complet du stockage et des Signals
    this.storageService.removeItem(this.TOKEN_KEY);
    this.storageService.removeItem(this.ROLE_KEY);
    this.storageService.removeItem(this.USER_INFO_KEY);

    this.isAuthenticated.set(false);
    this.currentUserRole.set(null);
    this.currentUser.set(null);

    if (currentRole === UserRole.ADMIN) {
      this.router.navigate(['/admin/login']);
    } else {
      this.router.navigate(['/auth']);
    }
  }

  getToken(): string | null {
    return this.storageService.getItem<string>(this.TOKEN_KEY);
  }

  getRoleFromStorage(): string | null {
    return this.storageService.getItem<string>(this.ROLE_KEY);
  }

  getUserFromStorage(): UserInfo | null {
    const data = this.storageService.getItem<UserInfo | string>(this.USER_INFO_KEY);

    if (!data) return null;

    // Si pour une raison quelconque le stockage a renvoyé une chaîne brute
    if (typeof data === 'string') {
      try {
        return JSON.parse(data) as UserInfo;
      } catch {
        return null;
      }
    }

    return data as UserInfo;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserRole() === role;
  }
}
