import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  // URL de base de votre backend Spring Boot
  private readonly baseUrl = 'http://localhost:8081';

  /**
   * Transforme un chemin relatif en URL complète accessible par le navigateur
   */
 public getFileUrl(relativePath: string | null | undefined): string {
    if (!relativePath) return '';

    if (relativePath.startsWith('http') || relativePath.startsWith('data:image')) {
      return relativePath;
    }

    const formattedPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    
    // 👈 Sépare le chemin pour encoder uniquement le nom du fichier (évite d'encoder les slashes '/')
    const lastSlashIndex = formattedPath.lastIndexOf('/');
    const directory = formattedPath.substring(0, lastSlashIndex + 1);
    const fileName = formattedPath.substring(lastSlashIndex + 1);

    // Encode proprement les espaces et caractères spéciaux du nom du fichier
    const encodedFileName = encodeURIComponent(fileName);

    return `${this.baseUrl}${directory}${encodedFileName}`;
  }

  public isPdf(url: string | null | undefined): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith('.pdf') || lower.includes('pdf');
  }
}
