import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BienService {
  private apiUrl = `${environment.apiUrl}/v1/biens`;
  private http = inject(HttpClient);

  /**
   * Envoie le bien au backend selon son type (VILLA, APPARTEMENT, TERRAIN, etc.)
   * @param typeId Type sélectionné ('VILLA', 'MAISON', 'APPARTEMENT', etc.)
   * @param formValue Valeur brute du FormGroup Angular
   * @param images Liste des fichiers images
   */
  createBien(typeId: string, formValue: any, images: File[]): Observable<any> {
    const formData = new FormData();
    const normalizedType = (typeId || '').toUpperCase();

    // 1. Génération du DTO spécifique selon le type de bien
    const payload = this.buildPayload(normalizedType, formValue);

    // 2. Encapsulation JSON dans un Blob pour 'data' (application/json)
    const dataBlob = new Blob([JSON.stringify(payload)], {
      type: 'application/json'
    });
    formData.append('data', dataBlob);

    // 3. Ajout des fichiers d'images
    if (images && images.length > 0) {
      images.forEach((file) => formData.append('images', file));
    }

    // 4. Mappage vers le bon endpoint Backend (Villa, Appartement ou Terrain)
    const targetUrl = this.getEndpointUrl(normalizedType);

    return this.http.post<any>(targetUrl, formData);
  }

  /**
   * Retourne l'URL de l'endpoint API approprié selon le type de bien
   */
  private getEndpointUrl(typeUpper: string): string {
    switch (typeUpper) {
      case 'APPARTEMENT':
      case 'STUDIO':
      case 'BUREAU':
      case 'COMMERCE':
        return `${this.apiUrl}/createAppartement`;

      case 'TERRAIN':
      case 'FERME':
        return `${this.apiUrl}/createTerrain`;

      case 'VILLA':
      case 'MAISON':
      default:
        return `${this.apiUrl}/createVilla`;
    }
  }

  /**
   * Nettoie et formate les données du formulaire selon le DTO attendu
   */
  private buildPayload(typeUpper: string, formValue: any): any {
    // Socle de données communes
    const commonData = {
      titre: formValue.titre || '',
      description: formValue.description || '',
      prix: Number(formValue.prix) || 0,
      ville: formValue.ville || 'Bamako',
      quartier: formValue.quartier || 'ACI 2000',
      adresse: formValue.adresse || '',
      latitude: Number(formValue.latitude) || 0,
      longitude: Number(formValue.longitude) || 0,
    };

    switch (typeUpper) {
      case 'VILLA':
      case 'MAISON':
        return {
          ...commonData,
          surfaceHabitable: Number(formValue.surfaceHabitable) || 0,
          surfaceTerrain: Number(formValue.surfaceTerrain) || 0,
          surfaceJardin: Number(formValue.surfaceJardin) || 0,
          nombreChambres: Number(formValue.nombreChambres) || 0,
          nombreFacades: Number(formValue.nombreFacades) || 1,
          garage: Boolean(formValue.garage),
          jardin: Boolean(formValue.jardin),
          piscine: Boolean(formValue.piscine)
        };

      case 'APPARTEMENT':
      case 'STUDIO':
      case 'BUREAU':
      case 'COMMERCE':
        return {
          ...commonData,
          surfaceHabitable: Number(formValue.surfaceHabitable) || 0,
          nombreChambres: Number(formValue.nombreChambres) || 0,
          etage: Number(formValue.etage) || 0,
          ascenseur: Boolean(formValue.ascenseur),
          balcon: Boolean(formValue.balcon),
          garage: Boolean(formValue.garage),
          meuble: Boolean(formValue.meuble),
          climatisation: Boolean(formValue.climatisation),
          securite: Boolean(formValue.securite)
        };

     case 'TERRAIN':
      case 'FERME':
        return {
          ...commonData,
          typeTerrain: formValue.typeTerrain || 'CONSTRUCTIBLE',
          superficieTotale: Number(formValue.superficieTotale) || 0,
          nombreFacades: Number(formValue.nombreFacades) || 1,
          zonage: formValue.zonage || '',
          viabilise: Boolean(formValue.viabilise),
          cloture: Boolean(formValue.cloture),
          titreFoncier: Boolean(formValue.titreFoncier),
          eau: Boolean(formValue.eau),
          electricite: Boolean(formValue.electricite),
          accesGoudronne: Boolean(formValue.accesGoudronne),
          assainissement: Boolean(formValue.assainissement)
        };

      default:
        return commonData;
    }
  }



  /**
   * Récupère l'ensemble des biens en combinant les endpoints paginés du backend
   */
  getTousLesBiens(page: number = 0, size: number = 50): Observable<any[]> {
    return forkJoin({
      villas: this.http.get<any>(`${this.apiUrl}/villas?page=${page}&size=${size}`).pipe(
        // Spring Data Page renvoie un objet avec la propriété 'content'
        map(response => (response?.content || []).map((item: any) => ({ ...item, type: 'VILLA' })))
      ),
      appartements: this.http.get<any>(`${this.apiUrl}/appartements?page=${page}&size=${size}`).pipe(
        map(response => (response?.content || []).map((item: any) => ({ ...item, type: 'APPARTEMENT' })))
      ),
      terrains: this.http.get<any>(`${this.apiUrl}/terrains?page=${page}&size=${size}`).pipe(
        map(response => (response?.content || []).map((item: any) => ({ ...item, type: 'TERRAIN' })))
      )
      // Ajoutez les terrains si le endpoint existe sur le même modèle :
      // terrains: this.http.get<any>(`${this.apiUrl}/terrains?page=${page}&size=${size}`).pipe(
      //   map(response => (response?.content || []).map((item: any) => ({ ...item, type: 'TERRAIN' })))
      // )
    }).pipe(
      map(results => [
        ...results.villas,
        ...results.appartements,
        ...(results.terrains || [])
        // ...(results.terrains || [])
      ])
    );
  }
}