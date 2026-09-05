export type UserStatut = 'ACTIF' | 'INACTIF' | 'SUSPENDU';

export interface Authority {
  authority: string;
}
export enum StatutAgence {
  EN_ATTENTE = 'EN_ATTENTE',
  ACTIF = 'ACTIF',
  REJETE = 'REJETE',
  SUSPENDU = 'SUSPENDU'
}

export interface AgenceAdmin {
  id: number;
  nom: string;                  // Le vrai nom renvoyé par le back
  nomAgence?: string | null;    // Au cas où
  email: string;
  telephone: string;
  adresse?: string | null;
  rccm?: string | null;
  rccmDocumentUrl?: string | null;
  nif?: string | null;
  nifDocumentUrl?: string | null;
  dateCreation: string;         // Remplacement de dateSoumission
  userStatut: string;           // 'ACTIF', etc.
  role: string;                 // 'AGENCE_IMMOBILIERE'
  isVerifier: boolean;
  enabled: boolean;
  authorities: Authority[];
}

export interface AgenceAdminDetails extends AgenceAdmin {
  motifRejet?: string | null;

}