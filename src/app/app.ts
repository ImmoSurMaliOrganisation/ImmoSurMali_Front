import { Component, inject, signal } from '@angular/core';
import { NavigationComponent } from './components/navigation.component/navigation.component';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [NavigationComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('immo-starter-pro');
  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }
  private router = inject(Router);

  // Signal ou fonction pour vérifier si on est sur la page auth
  isAuthPage(): boolean {
    return this.router.url === '/auth';
  }
}
