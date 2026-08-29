export enum Role {
  ADMIN = 'ADMIN',
  AGENCE_IMMOBILIERE = 'AGENCE_IMMOBILIERE',
  PROPRIETAIRE_PART = 'PROPRIETAIRE_PART',
  CLIENT = 'CLIENT'
}

export interface User {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: Role;
  isVerifier: boolean;
  userStatut: string;
  dateCreation?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}