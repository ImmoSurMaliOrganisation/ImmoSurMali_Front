import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { ButtonComponent } from '../../../client/shared/components/button.component';
import { FormInputComponent } from '../../../client/shared/components/form-input/form-input.component';
import { ThemeService } from '../../../core/services/theme';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth';
import { CommonModule } from '@angular/common';

export type AccountType = 'PROPRIETAIRE' | 'AGENCE';

@Component({
  selector: 'app-propio-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    FormInputComponent,
    ReactiveFormsModule,
    RouterLink,
    LucideMoon,
    LucideSun,
  ],
  templateUrl: './propio-login.html',
  styleUrl: './propio-login.css',
})
export class PropioLogin {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  // ÉTATS
  accountType = signal<AccountType>('PROPRIETAIRE');
  currentStep = signal<number>(1); // Stepper (1 ou 2) pour Agence
  isLoading = signal(false);
  showSuccessMessage = signal(false);
  errorMessage = signal<string | null>(null);

  // Fichiers pour Agence
  rccmFile = signal<File | null>(null);
  nifFile = signal<File | null>(null);

  // Preview URLs
  rccmPreviewUrl = signal<string | null>(null);
  nifPreviewUrl = signal<string | null>(null);

  LucideSun = LucideSun;
  LucideMoon = LucideMoon;

  // Regex OHADA/Mali
  private rccmRegex = '^M[L|A]-[A-Z]{3}-\\d{4}-[A|B]-\\d{1,6}$';
  private nifRegex = '^\\d{9}[A-Z]$';

  proForm = this.fb.nonNullable.group({
    // Champs communs & Propriétaire
    nom: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    telephone: ['', [Validators.required, Validators.pattern('^[0-9+\\s-]{8,15}$')]],
    adresse: [''],

    // Champs spécifiques Agence
    rccm: [''],
    nif: [''],
    acceptTruth: [false], // Attestation d'exactitude (Agence)
    acceptTerms: [false, [Validators.requiredTrue]], // CGU (Tous)
  });

  setAccountType(type: AccountType): void {
    this.accountType.set(type);
    this.currentStep.set(1);
    this.errorMessage.set(null);
    this.updateValidations();
  }

  updateValidations(): void {
    const rccmCtrl = this.proForm.controls.rccm;
    const nifCtrl = this.proForm.controls.nif;
    const adresseCtrl = this.proForm.controls.adresse;
    const acceptTruthCtrl = this.proForm.controls.acceptTruth;

    if (this.accountType() === 'AGENCE') {
      rccmCtrl.setValidators([Validators.required, Validators.pattern(this.rccmRegex)]);
      nifCtrl.setValidators([Validators.pattern(this.nifRegex)]);
      adresseCtrl.setValidators([Validators.required]);
      acceptTruthCtrl.setValidators([Validators.requiredTrue]);
    } else {
      rccmCtrl.clearValidators();
      nifCtrl.clearValidators();
      adresseCtrl.clearValidators();
      acceptTruthCtrl.clearValidators();
    }

    rccmCtrl.updateValueAndValidity();
    nifCtrl.updateValueAndValidity();
    adresseCtrl.updateValueAndValidity();
    acceptTruthCtrl.updateValueAndValidity();
  }

  nextStep(): void {
    const controls = this.proForm.controls;
    if (
      controls.nom.invalid ||
      controls.email.invalid ||
      controls.password.invalid ||
      controls.telephone.invalid ||
      controls.adresse.invalid
    ) {
      this.proForm.markAllAsTouched();
      this.errorMessage.set('Veuillez remplir correctement les informations générales.');
      return;
    }
    this.errorMessage.set(null);
    this.currentStep.set(2);
  }

  prevStep(): void {
    this.errorMessage.set(null);
    this.currentStep.set(1);
  }

  onFileSelected(event: Event, type: 'rccm' | 'nif'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (type === 'rccm') {
      this.rccmFile.set(file);
      if (file.type.startsWith('image/')) {
        this.rccmPreviewUrl.set(URL.createObjectURL(file));
      } else {
        this.rccmPreviewUrl.set('pdf');
      }
    } else if (type === 'nif') {
      this.nifFile.set(file);
      if (file.type.startsWith('image/')) {
        this.nifPreviewUrl.set(URL.createObjectURL(file));
      } else {
        this.nifPreviewUrl.set('pdf');
      }
    }
  }

  isPdf(file: File | null): boolean {
    return file?.type === 'application/pdf';
  }

  onSubmit(): void {
    if (this.proForm.invalid) {
      this.proForm.markAllAsTouched();
      this.errorMessage.set('Veuillez remplir correctement tous les champs obligatoires.');
      return;
    }

    if (this.accountType() === 'AGENCE' && !this.rccmFile()) {
      this.errorMessage.set('Le document justificatif RCCM est obligatoire pour une agence.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const val = this.proForm.getRawValue();

    if (this.accountType() === 'AGENCE') {
      const formData = new FormData();
      formData.append('nomAgence', val.nom);
      formData.append('email', val.email);
      formData.append('motDePasse', val.password);
      formData.append('telephone', val.telephone);
      formData.append('adresse', val.adresse);
      formData.append('rccm', val.rccm);
      if (this.rccmFile()) formData.append('rccmDocument', this.rccmFile()!);

      if (val.nif) formData.append('nif', val.nif);
      if (this.nifFile()) formData.append('nifDocument', this.nifFile()!);

      this.authService.registerAgence(formData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.showSuccessMessage.set(true);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            err.error?.message || "Une erreur est survenue lors de la demande d'inscription.",
          );
        },
      });
    } else {
      const payload = {
        nom: val.nom,
        email: val.email,
        motDePasse: val.password,
        telephone: val.telephone,
      };

      this.authService.registerProprietaire(payload).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.showSuccessMessage.set(true);
          setTimeout(() => this.router.navigate(['/pro/dashboard']), 1200);
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