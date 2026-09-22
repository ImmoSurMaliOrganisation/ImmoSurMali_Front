export interface CreateAppartementRequest {
  titre: string;
  description?: string;
  prix: number;
  surfaceHabitable?: number;
  ville: string;
  quartier: string;
  adresse?: string;
  latitude?: number;
  longitude?: number;
  nombreChambres?: number;
  estMeuble?: boolean;
  etage?: number;
  ascenseur?: boolean;
  piscine?: boolean;
  chargesMensuelles?: number;
  surfaceBalcon?: number;
  parkingInclus?: boolean;
}

export interface MediaResponse {
  id: string;
  url: string;
  type: string;
  estPrincipal: boolean;
}

export interface AppartementResponse {
  id: string;
  titre: string;
  description: string;
  prix: number;
  surfaceHabitable: number;
  statut: string;
  ville: string;
  quartier: string;
  adresse: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  nombreChambres: number;
  estMeuble: boolean;
  etage: number;
  ascenseur: boolean;
  piscine: boolean;
  chargesMensuelles: number;
  surfaceBalcon: number;
  parkingInclus: boolean;
  medias: MediaResponse[];
}