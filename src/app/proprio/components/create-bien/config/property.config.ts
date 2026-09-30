export type PropertyType = 'VILLA' | 'APPARTEMENT' | 'MAISON' | 'STUDIO' | 'TERRAIN' | 'BUREAU' | 'COMMERCE' | 'FERME';

export interface PropertyTypeConfig {
  id: PropertyType;
  label: string;
  category: 'RESIDENTIEL' | 'TERRAIN' | 'COMMERCIAL';
  description: string;
  iconPath: string;
}

export const PROPERTY_TYPES: PropertyTypeConfig[] = [
  {
    id: 'APPARTEMENT',
    label: 'Appartement',
    category: 'RESIDENTIEL',
    description: 'Copropriété ou immeuble',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  },
    {
    id: 'STUDIO',
    label: 'Studio',
    category: 'RESIDENTIEL',
    description: 'Espace compact 1 pièce',
    iconPath: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z'
  },
 {
    id: 'VILLA',
    label: 'Villa',
    category: 'RESIDENTIEL',
    description: 'Maison individuelle haut standing',
    // Icône spécifique Villa (Grand standing / structure ouverte)
    iconPath: 'M8 14v5H4v-7l8-6 8 6v7h-4v-5H8z M12 3L2 11h3v10h14V11h3L12 3z'
  },
  {
    id: 'MAISON',
    label: 'Maison',
    category: 'RESIDENTIEL',
    description: 'Maison de ville ou Riad',
    // Icône spécifique Maison classique / urbaine
    iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },{
    id: 'COMMERCE',
    label: 'Commerce',
    category: 'COMMERCIAL',
    description: 'Local commercial ou magasin',
    iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
  },

  {
    id: 'TERRAIN',
    label: 'Terrain',
    category: 'TERRAIN',
    description: 'Parcelle nue ou constructible',
    iconPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
  },
  // {
  //   id: 'BUREAU',
  //   label: 'Bureau',
  //   category: 'COMMERCIAL',
  //   description: 'Espace de travail professionnel',
  //   iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  // },
  
  // {
  //   id: 'FERME',
  //   label: 'Ferme / Domaine',
  //   category: 'TERRAIN',
  //   description: 'Propriété agricole ou grande superficie',
  //   iconPath: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
  // }
];