import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  LucideEye,
  LucideEyeOff,
  LucideLogIn,
  LucideMail,
  LucideCheck,
  LucideDynamicIcon,
  LucideLock,
  LucideUser,
  LucideUserPlus,
} from '@lucide/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideMail,
    LucideUser,
    LucideLock,
    LucideUser,
    LucideCheck,
    LucideDynamicIcon,
  ],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoading = signal(false);
  showPassword = signal(false);
  authForm!: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoginMode = signal(true);
  LucideLogIn = LucideLogIn;
  LucideUserPlus = LucideUserPlus;
  LucideEye = LucideEye;
  LucideEyeOff = LucideEyeOff;
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    // Formulaire avec validation stricte
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
      fullName: [''],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  // Action de connexion
  async onSignIn() {
    this.toggleMode();
    if (!this.isLoginMode()) {
      this.router.navigate(['/properties']);
    }
    if (this.authForm.invalid) {
      this.errorMessage.set('Veuillez remplir tous les champs correctement.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
  }

  // Connexions sociales
  loginWithSocial(provider: 'google' | 'facebook') {
    console.log(`Authentification avec ${provider}...`);
    // Intégration Firebase ou OAuth ici
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }
  toggleMode() {
    this.isLoginMode.update((v) => !v);
    this.authForm.reset(); // Nettoie le formulaire au changement
  }
}
