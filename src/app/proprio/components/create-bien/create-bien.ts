import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BienService } from '../../../core/services/bien.service';
import { PROPERTY_TYPES, PropertyType } from './config/property.config';
import { FeaturesVillaComponent } from './features-villa.component';
import { StepTypeComponent } from './step-type.component';
import { StepGeneralComponent } from './step-general.component';
import { ImagePreview, StepMediaComponent } from './step-media.component';
import { StepLocationComponent } from './step-location.component';
import { FeaturesAppartementComponent } from './features-appartement.component';
import { FeaturesTerrainComponent } from './features-terrain.component';

@Component({
  selector: 'app-create-bien',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FeaturesVillaComponent,
    StepTypeComponent,
    StepGeneralComponent,
    StepMediaComponent,
    StepLocationComponent,
    FeaturesAppartementComponent,
    FeaturesTerrainComponent,
  ],
  templateUrl: './create-bien.html',
})
export class CreateBien implements OnInit {
  currentStep = signal<number>(1);
  selectedType = signal<PropertyType | null>(null);
  isSubmitting = signal<boolean>(false);

  errorMessage = signal<string | null>(null);
  imagePreviews = signal<ImagePreview[]>([]);

  bienForm!: FormGroup;

  currentTypeConfig = computed(
    () => PROPERTY_TYPES.find((t) => t.id === this.selectedType()) || null,
  );

  progressPercentage = computed(() => (this.currentStep() / 5) * 100);

  constructor(
    private fb: FormBuilder,
    private bienService: BienService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.bienForm = this.fb.group({
      // Étape 1 & 2 : Communs (Requis)
      type: ['', Validators.required],
      titre: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      prix: [null, [Validators.required, Validators.min(1)]],
      typeTransaction: ['LOCATION', Validators.required],

      // Étape 3 : Localisation (Requis)
      ville: ['', Validators.required],
      quartier: ['', Validators.required],
      adresse: ['', Validators.required],
      latitude: [null],
      longitude: [null],

      // Optionnels communs
      caution: [null, Validators.min(0)],
      fraisSyndic: [null, Validators.min(0)],

      // Étape 4 : Attributs Appartement / Villa (Dynamiques)
      surfaceHabitable: [null],
      etage: [null],
      nombreEtages: [null],
      balcon: [false],
      meuble: [false],
      climatisation: [false],
      securite: [false],
      surfaceTerrain: [null],
      nombreChambres: [0],
      nombreFacades: [1],
      jardin: [false],
      piscine: [false],
      garage: [false],
      ascenseur: [false],

      // Étape 4 : Attributs Terrain / Ferme (Dynamiques)
      typeTerrain: [''],
      superficieTotale: [null],
      zonage: [''],
      viabilise: [false],
      cloture: [false],
      titreFoncier: [false],
      eau: [false],
      electricite: [false],
      accesGoudronne: [false],
      assainissement: [false],
    });
  }

  onTypeSelected(type: PropertyType): void {
    this.selectedType.set(type);
    this.bienForm.patchValue({ type });
    this.updateValidatorsBasedOnType(type);
  }

  // Ajustement dynamique des validateurs selon le type de bien sélectionné
  private updateValidatorsBasedOnType(type: PropertyType | string): void {
    const surfaceHabitable = this.bienForm.get('surfaceHabitable');
    const typeTerrain = this.bienForm.get('typeTerrain');
    const superficieTotale = this.bienForm.get('superficieTotale');

    // Réinitialisation des validateurs spécifiques
    surfaceHabitable?.clearValidators();
    typeTerrain?.clearValidators();
    superficieTotale?.clearValidators();

    if (type === 'TERRAIN' || type === 'FERME') {
      typeTerrain?.setValidators([Validators.required]);
      superficieTotale?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      surfaceHabitable?.setValidators([Validators.required, Validators.min(1)]);
    }

    surfaceHabitable?.updateValueAndValidity();
    typeTerrain?.updateValueAndValidity();
    superficieTotale?.updateValueAndValidity();
  }

  // --- Gestion des images (Étape 5) ---
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    this.errorMessage.set(null);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        this.errorMessage.set('Veuillez sélectionner uniquement des images.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.imagePreviews.update((prev) => [...prev, { file, url: e.target!.result as string }]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.imagePreviews.update((prev) => prev.filter((_, i) => i !== index));
  }

  // --- Navigation & Validation par étape ---
  nextStep(): void {
    if (this.currentStep() < 5 && this.isStepValid(this.currentStep())) {
      this.currentStep.update((s) => s + 1);
      this.errorMessage.set(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.errorMessage.set('Veuillez remplir correctement les champs requis de cette étape.');
      this.markCurrentStepAsTouched();
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((s) => s - 1);
      this.errorMessage.set(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Vérification rigoureuse étape par étape pour libérer le bouton "Suivant"
  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.selectedType();
      case 2:
        return !!(
          this.bienForm.get('titre')?.valid &&
          this.bienForm.get('description')?.valid &&
          this.bienForm.get('prix')?.valid &&
          this.bienForm.get('typeTransaction')?.valid
        );
      case 3:
        return !!(
          this.bienForm.get('ville')?.valid &&
          this.bienForm.get('quartier')?.valid &&
          this.bienForm.get('adresse')?.valid
        );
      case 4:
        const type = this.selectedType();
        if (type === 'TERRAIN' || type === 'FERME') {
          return !!(this.bienForm.get('typeTerrain')?.valid && this.bienForm.get('superficieTotale')?.valid);
        }
        return !!this.bienForm.get('surfaceHabitable')?.valid;
      case 5:
        return this.imagePreviews().length > 0;
      default:
        return true;
    }
  }

  private markCurrentStepAsTouched(): void {
    const stepFields: Record<number, string[]> = {
      2: ['titre', 'description', 'prix', 'typeTransaction'],
      3: ['ville', 'quartier', 'adresse'],
      4: this.selectedType() === 'TERRAIN' ? ['typeTerrain', 'superficieTotale'] : ['surfaceHabitable'],
    };
    const fields = stepFields[this.currentStep()];
    if (fields) {
      fields.forEach((f) => this.bienForm.get(f)?.markAsTouched());
    }
  }

  onSubmit(): void {
    if (this.bienForm.invalid || this.imagePreviews().length === 0) {
      this.errorMessage.set('Veuillez vérifier tous les champs et ajouter au moins une image.');
      this.bienForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const filesToSend: File[] = this.imagePreviews().map((img) => img.file);
    const bienType = (this.selectedType() || this.bienForm.get('type')?.value || 'VILLA').toString();

    this.bienService.createBien(bienType, this.bienForm.value, filesToSend).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/biens']);
      },
      error: (err) => {
        console.error('Erreur lors de la création du bien :', err);
        this.errorMessage.set('Une erreur réseau est survenue lors de la publication du bien.');
        this.isSubmitting.set(false);
      },
    });
  }
}