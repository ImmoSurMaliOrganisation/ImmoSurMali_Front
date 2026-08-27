import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormInputComponent } from '../../../client/shared/components/form-input/form-input.component';
import { ButtonComponent } from '../../../client/shared/components/button.component';

import { LucideShieldCheck, LucideSun, LucideMoon } from '@lucide/angular';
import { ThemeService } from '../../../core/services/theme';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
    LucideShieldCheck,
    LucideSun,
    LucideMoon,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  // Signal pour afficher la notification de succès en vert
  showSuccessMessage = signal(false);
  
  // Signal pour lancer l'agrandissement SVG et la disparition de la carte
  isSuccessExit = signal(false);

  // Signals réactifs pour gérer les états du formulaire
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Formulaire réactif avec validations strictes
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
  });

onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        // Validation du rôle Administrateur (Tickets ISM-11 / ISM-22)
        if (response.role === 'ADMIN') {
          // Étape 1 : Afficher immédiatement la notification de succès
          this.showSuccessMessage.set(true);

          // Étape 2 : Lancer l'animation d'expansion SVG après 1,2 seconde de lecture
          setTimeout(() => {
            this.isSuccessExit.set(true);
          }, 1200);

          // Étape 3 : Naviguer vers le dashboard à la fin de l'animation de sortie
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 1800);

        } else {
          this.authService.logout();
          this.errorMessage.set(
            "Accès refusé : Ce compte ne possède pas les privilèges d'administrateur."
          );
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set("Email ou mot de passe incorrect.");
        } else {
          this.errorMessage.set(
            err.error?.message || "Une erreur est survenue lors de la connexion au serveur."
          );
        }
      },
    });
  }
}
