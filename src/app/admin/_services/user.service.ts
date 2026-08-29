import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PageResponse, Role, User } from '../_models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/admin/users`;

  /**
   * Récupère la liste paginée des utilisateurs avec recherche optionnelle
   */
  getUsers(
    role?: Role,
    search?: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    direction: string = 'ASC',
  ): Observable<PageResponse<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    if (role) {
      params = params.set('role', role);
    }
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PageResponse<User>>(this.apiUrl, { params });
  }

  /**
   * Récupère un utilisateur spécifique par son ID
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Modifie le statut d'un utilisateur (ex: ACTIF, SUSPENDU)
   */
  updateUserStatut(id: number, statut: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/toggle-status`, {});
  }

  /**
   * Modifie le rôle d'un utilisateur (ex: CLIENT, PROPRIETAIRE_PART, AGENCE_IMMOBILIERE, ADMIN)
   */
  updateUserRole(id: number, role: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/role`, { role });
  }

  /**
   * Supprime un utilisateur par son ID
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
