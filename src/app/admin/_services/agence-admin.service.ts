import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AgenceAdmin, StatutAgence } from '../_models/agence.model';

@Injectable({
  providedIn: 'root',
})
export class AgenceAdminService {
  // Utilisation d'un Signal pour les agences afin de rendre les compteurs réactifs
  private mockAgences = signal<AgenceAdmin[]>([]);

  constructor() {
    // Optionnel : Générer par exemple 30 agences au démarrage pour tester la pagination
    this.genererMockAgences(30);
  }

  // Signal calculé pour compter automatiquement les agences en attente
  public nombreAgencesEnAttente = computed(() => 
    this.mockAgences().filter(a => a.statut === 'EN_ATTENTE').length
  );
  
  /**
   * Méthode pour générer un nombre personnalisé d'agences factices avec des documents en ligne
   */
  public genererMockAgences(nombreTotal: number): void {
    const statuts: StatutAgence[] = ['EN_ATTENTE', 'VALIDE', 'REJETE', 'SUSPENDU'];
    const villes = [
      'ACI 2000, Bamako',
      'Badalabougou, Bamako',
      'Kalaban Coro, Bamako',
      'Hamdallaye, Bamako',
      'Bandiagara',
      'Ségou',
    ];
    const nomsBases = [
      'Horizon Immo',
      'Mali Bâtiment',
      'Garantie Logis',
      'Sahel Gestion',
      'Koulouba Immobilier',
      'Sanita Logement',
    ];

    const documentsExemples = [
      {
        rccmUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        nifUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
      },
      {
        rccmUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        nifUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    ];

    const agencesGenerees: AgenceAdmin[] = [];

    for (let i = 1; i <= nombreTotal; i++) {
      const statutAleatoire = statuts[Math.floor(Math.random() * statuts.length)];
      const nomAleatoire = `${nomsBases[i % nomsBases.length]} ${i}`;
      const adresseAleatoire = villes[i % villes.length];
      const docChoisi = documentsExemples[i % documentsExemples.length];

      agencesGenerees.push({
        id: i,
        nomAgence: nomAleatoire,
        email: `contact${i}@immo-mali.ml`,
        telephone: `+223 ${70 + (i % 10)} ${String(i).padStart(2, '0')} 00 0${i % 10}`,
        adresse: adresseAleatoire,
        rccm: `ML-BKO-2026-B-${1000 + i}`,
        rccmDocumentUrl: docChoisi.rccmUrl,
        nif: `${100000000 + i}A`,
        nifDocumentUrl: docChoisi.nifUrl,
        dateSoumission: `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
        statut: statutAleatoire,
        isVerifier: statutAleatoire === 'VALIDE',
        motifRejet: statutAleatoire === 'REJETE' ? 'Dossier incomplet ou non conforme.' : undefined,
      });
    }

    // Mise à jour du signal
    this.mockAgences.set(agencesGenerees);
  }

  // Récupérer toutes les agences pour la gestion globale
  getToutesLesAgences(): Observable<AgenceAdmin[]> {
    return of(this.mockAgences()).pipe(delay(300));
  }

  /**
   * Récupérer une agence par son ID (pour la page de détails)
   */
  public getAgenceById(id: number): Observable<AgenceAdmin | undefined> {
    const agence = this.mockAgences().find(a => a.id === id);
    return of(agence);
  }

  // Valider une agence en attente
  validerDemande(id: number): Observable<AgenceAdmin> {
    const updatedList = this.mockAgences().map((a) =>
      a.id === id
        ? { ...a, statut: 'VALIDE' as StatutAgence, isVerifier: true, motifRejet: undefined }
        : a,
    );
    this.mockAgences.set(updatedList);
    const updated = this.mockAgences().find((a) => a.id === id)!;
    return of(updated).pipe(delay(300));
  }

  // Rejeter une agence avec un motif obligatoire
  rejeterDemande(id: number, motif: string): Observable<AgenceAdmin> {
    const updatedList = this.mockAgences().map((a) =>
      a.id === id
        ? { ...a, statut: 'REJETE' as StatutAgence, isVerifier: false, motifRejet: motif }
        : a,
    );
    this.mockAgences.set(updatedList);
    const updated = this.mockAgences().find((a) => a.id === id)!;
    return of(updated).pipe(delay(300));
  }
}