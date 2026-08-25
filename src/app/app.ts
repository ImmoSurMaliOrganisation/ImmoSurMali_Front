import { Component, inject, signal } from '@angular/core';
import { NavigationComponent } from './components/navigation.component/navigation.component';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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


  serverMessage: string = 'Chargement...';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:8080/api/test', { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.serverMessage = response;
          console.log('Réponse du back :', response);
        },
        error: (error) => {
          this.serverMessage = 'Erreur de connexion au serveur ou CORS !';
          console.error('Erreur :', error);
        }
      });
  }
}
