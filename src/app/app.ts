import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('immosur-mali');
  private router = inject(Router);
  public themeService = inject(ThemeService);

  // Signal ou fonction pour vérifier si on est sur la page auth
  isAuthPage(): boolean {
    return this.router.url === '/auth';
  }

}
