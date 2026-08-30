export type StatutAgence = 'EN_ATTENTE' | 'VALIDE' | 'REJETE' | 'SUSPENDU';

export interface AgenceAdmin {
  id: number;
  nomAgence: string;
  email: string;
  telephone: string;
  adresse: string;
  rccm: string;
  rccmDocumentUrl?: string;
  nif?: string;
  nifDocumentUrl?: string;
  dateSoumission: string;
  statut: StatutAgence;
  isVerifier: boolean;
  motifRejet?: string;
}