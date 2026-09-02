import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import { AgenceAdmin, AgenceAdminDetails, UserStatut } from '../_models/agence.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgenceAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/admin/agences`;

  // Utilisation d'un Signal pour les agences afin de rendre les compteurs réactifs
  private agencesSignal = signal<AgenceAdmin[]>([]);
  public agences = this.agencesSignal.asReadonly();

  // Signal pour stocker le nombre total d'éléments venant de Spring Boot
  private totalElementsSignal = signal<number>(0);
  public totalElements = this.totalElementsSignal.asReadonly();

  // Signal pour le total des agences (vous pouvez garder l'un ou l'autre, totalElements suffit largement)
  private countTotalSignal = signal<number>(0);
  public countTotal = this.countTotalSignal.asReadonly();

  // Signal calculé pour compter automatiquement les agences en attente
  public nombreAgencesEnAttente = computed(
    () => this.agencesSignal().filter((a) => a.userStatut === 'EN_ATTENTE').length,
  );

  /**
   * Récupère la liste paginée des agences depuis l'API
   */
  public chargerAgences(
    page: number = 0,
    size: number = 10,
    statut?: string,
    search?: string,
  ): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (statut && statut !== 'TOUTES') params = params.set('statut', statut);
    if (search && search.trim() !== '') params = params.set('search', search.trim());

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap((response) => {
        const data = response.content ? response.content : response;
        this.agencesSignal.set(data);

        // On met à jour le total global d'éléments renvoyé par la pagination Spring Boot
        if (response.totalElements !== undefined) {
          this.totalElementsSignal.set(response.totalElements);
          this.countTotalSignal.set(response.totalElements);
        } else {
          this.totalElementsSignal.set(data.length);
          this.countTotalSignal.set(data.length);
        }
      }),
    );
  }

  /**
   * Récupérer une agence par son ID depuis le backend
   */
  public getAgenceById(id: number): Observable<AgenceAdminDetails> {
    return this.http.get<AgenceAdminDetails>(`${this.apiUrl}/${id}`);
  }
  // Valider une agence en attente (Passe le statut à ACTIF)
  validerDemande(id: number): Observable<AgenceAdminDetails> {
    const updatedList = this.agencesSignal().map((a) =>
      a.id === id ? { ...a, userStatut: 'ACTIF' as UserStatut, isVerifier: true } : a,
    );
    this.agencesSignal.set(updatedList);
    const updated = this.agencesSignal().find((a) => a.id === id)!;
    return of(updated).pipe(delay(300));
  }

  // Rejeter une agence avec un motif obligatoire
  rejeterDemande(id: number, motif: string): Observable<AgenceAdmin> {
    const updatedList = this.agencesSignal().map((a) =>
      a.id === id
        ? { ...a, userStatut: 'SUSPENDU' as UserStatut, isVerifier: false, motifRejet: motif }
        : a,
    );
    this.agencesSignal.set(updatedList);
    const updated = this.agencesSignal().find((a) => a.id === id)!;
    return of(updated).pipe(delay(300));
  }
}
