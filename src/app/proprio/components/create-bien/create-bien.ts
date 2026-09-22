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
  // Signals d'état
  currentStep = signal<number>(1);
  selectedType = signal<PropertyType | null>(null);
  isSubmitting = signal<boolean>(false);

  // Variables nécessaires pour StepMediaComponent
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
      type: ['', Validators.required],
      titre: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      prix: [null, [Validators.required, Validators.min(1)]],
      surfaceHabitable: [null, [Validators.required, Validators.min(1)]],
      ville: ['', Validators.required],
      quartier: ['', Validators.required],
      adresse: ['', Validators.required],
      latitude: [null],
      longitude: [null],

      typeTransaction: ['LOCATION', Validators.required],

      // Attributs Villa / Maison
      surfaceTerrain: [null],
      nombreChambres: [0],
      nombreFacades: [1],
      jardin: [false],
      piscine: [false],
      garage: [false],
      ascenseur: [false],
      // Attributs Terrain / Ferme
      typeTerrain: ['', Validators.required],
      superficieTotale: [null, Validators.required],
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

  // --- Navigation ---
  nextStep(): void {
    if (this.currentStep() < 5 && this.isStepValid(this.currentStep())) {
      this.currentStep.update((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  isStepValid(step: number): boolean {
    if (step === 1) return !!this.selectedType();
    return true;
  }
  onSubmit(): void {
    // 1. Validation globale du formulaire
    if (this.bienForm.invalid) {
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires correctement.');
      this.bienForm.markAllAsTouched();
      return;
    }

    // 2. Vérification de la présence d'au moins une image
    if (this.imagePreviews().length === 0) {
      this.errorMessage.set('Veuillez ajouter au moins une image de votre bien.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    // 3. Extraction des objets File réels
    const filesToSend: File[] = this.imagePreviews().map((img) => img.file);

    // 4. FIX : Récupérer l'ID du type réel ('VILLA', 'APPARTEMENT', 'TERRAIN')
    // et non la catégorie ('RESIDENTIEL')
    const bienType = (
      this.selectedType() ||
      this.bienForm.get('type')?.value ||
      'VILLA'
    ).toString();

    // 5. Envoi au Backend
    this.bienService.createBien(bienType, this.bienForm.value, filesToSend).subscribe({
      next: (response) => {
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
