export interface CreateVillaRequest {
  titre: string;
  description: string;
  prix: number;
  surfaceHabitable: number;
  ville: string;
  quartier: string;
  adresse: string;
  latitude?: number;
  longitude?: number;
  proprietaireId: number;

  surfaceTerrain: number;
  nombreChambres?: number;
  nombreFacades: number;
  jardin: boolean;
  surfaceJardin?: number;
  piscine: boolean;
  garage: boolean;
}

export interface MediaResponse {
  id: number;
  url: string;
  type: string;
  estPrincipal: boolean;
}

export interface VillaResponse {
  id: string;
  titre: string;
  description: string;
  prix: number;
  surfaceHabitable: number;
  statut: string;
  ville: string;
  quartier: string;
  adresse: string;
  latitude?: number;
  longitude?: number;
  proprietaireId: number;
  createdAt: string;

  surfaceTerrain: number;
  nombreChambres: number;
  nombreFacades: number;
  jardin: boolean;
  surfaceJardin?: number;
  piscine: boolean;
  garage: boolean;
  medias: MediaResponse[];
}