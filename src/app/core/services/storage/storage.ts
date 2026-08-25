import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Enregistre un élément (String ou Objet)
   */
  setItem(key: string, value: any): void {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, data);
  }
  /**
   * Récupère un élément
   */
  getItem<T>(key: string): T | string | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch {
      return item; // Retourne la chaîne simple si ce n'est pas du JSON (ex: le Token JWT)
    }
  }

  /**
   * Supprime une clé spécifique
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Vide tout le stockage local
   */
  clear(): void {
    localStorage.clear();
  }
}
