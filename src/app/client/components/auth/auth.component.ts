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
  LucideSun,
  LucideMoon,
} from '@lucide/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth';
import { ThemeService } from '../../../core/services/theme';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { UserRole } from '../../../core/models/user-role.enum';

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
    LucideSun,
    LucideMoon,
    FormInputComponent,
    ButtonComponent,
  ],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  // Management des états visuels et de soumission
  isLoginMode = signal(true);
  showPassword = signal(false);
  isLoading = signal(false);
  showSuccessMessage = signal(false);
  errorMessage = signal<string | null>(null);

  // Exposition des icônes Lucide pour le template
  LucideSun = LucideSun;
  LucideMoon = LucideMoon;

  // Formulaire réactif nonNullable
  authForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: [''],
    phone: [''],
    acceptTerms: [false],
  });

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleMode(): void {
    this.isLoginMode.update((v) => !v);
    this.errorMessage.set(null);
    this.showSuccessMessage.set(false);
    this.authForm.reset();

    const fullNameCtrl = this.authForm.controls.fullName;
    const phoneCtrl = this.authForm.controls.phone;
    const termsCtrl = this.authForm.controls.acceptTerms;

    if (!this.isLoginMode()) {
      fullNameCtrl.setValidators([Validators.required]);
      phoneCtrl.setValidators([Validators.required, Validators.pattern('^[0-9+\\s-]{8,15}$')]);
      termsCtrl.setValidators([Validators.requiredTrue]);
    } else {
      fullNameCtrl.clearValidators();
      phoneCtrl.clearValidators();
      termsCtrl.clearValidators();
    }

    fullNameCtrl.updateValueAndValidity();
    phoneCtrl.updateValueAndValidity();
    termsCtrl.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      this.errorMessage.set('Veuillez remplir correctement tous les champs obligatoires.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password, fullName, phone } = this.authForm.getRawValue();

    if (this.isLoginMode()) {
      // MODE CONNEXION
      this.authService.login({ email, motDePasse: password }).subscribe({
        next: (response: any) => {
          this.isLoading.set(false);
          this.showSuccessMessage.set(true);

          // Redirection dynamique pour TOUS les rôles
          setTimeout(() => {
            switch (response.role) {
              case UserRole.ADMIN:
              case 'ADMIN':
                this.router.navigate(['/admin/dashboard']);
                break;

              case UserRole.AGENCE:
              case UserRole.PROPRIETAIRE:
              case 'AGENCE':
              case 'PROPRIETAIRE':
                this.router.navigate(['/pro/dashboard']);
                break;

              case 'CLIENT':
              default:
                this.router.navigate(['/profile']);
                break;
            }
          }, 1200);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.status === 401) {
            this.errorMessage.set('Adresse email ou mot de passe incorrect.');
          } else {
            this.errorMessage.set(
              err.error?.message || 'Une erreur est survenue lors de la connexion.',
            );
          }
        },
      });
    } else {
      // MODE INSCRIPTION
      const registerPayload = {
        nom: fullName,
        email: email,
        motDePasse: password,
        telephone: phone,
      };

      this.authService.registerClient(registerPayload).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.showSuccessMessage.set(true);

          // Redirection directe après l'inscription (sans repasser par la connexion)
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1200);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            err.error?.message || "Une erreur est survenue lors de l'inscription.",
          );
        },
      });
    }
  }
}
