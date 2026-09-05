import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgenceAdminService } from '../../_services/agence-admin.service';
import { AgenceAdminDetails } from '../../_models/agence.model';
import { SafeUrlPipe } from '../../../core/pipes/safe-url.pipe';
import {
  LucideAlertCircle,
  LucideAlertTriangle,
  LucideArrowLeft,
  LucideCheck,
  LucideCheckCircle2,
  LucideContact,
  LucideEye,
  LucideFileSearch,
  LucideFileText,
  LucideShieldCheck,
  LucideX,
  LucideXCircle,
} from '@lucide/angular';
import { MediaService } from '../../../core/services/media.service';

@Component({
  selector: 'app-agence-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SafeUrlPipe,
    LucideXCircle,
    LucideX,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideAlertCircle,
    LucideCheck,
    LucideContact,
    LucideShieldCheck,
    LucideFileText,
    LucideAlertTriangle,
    LucideEye,
    LucideFileSearch,
  ],
  templateUrl: './agence-details.html',
  styleUrl: './agence-details.css',
})
export class AgenceDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private agenceService = inject(AgenceAdminService);

  public mediaService = inject(MediaService);

  // Signaux pour la visionneuse
  selectedPreviewUrl = signal<string | null>(null);
  selectedPreviewTitle = signal<string>('');
  isFullScreen = signal<boolean>(false);

  agence = signal<AgenceAdminDetails | null | undefined>(null);
  isLoading = signal<boolean>(true);

  // Messages, modale de rejet & états de chargement
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showRejectModal = signal<boolean>(false);
  motifRejetInput = signal<string>('');
  modalErrorMessage = signal<string>('');
  isSubmitting = signal<boolean>(false);

  safePreviewUrl = computed(() => this.selectedPreviewUrl() ?? '');

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.chargerAgence(+idParam);
    }
  }

  initialiserPreview(relativePath: string | null | undefined, title: string) {
    if (!relativePath) return;

    const absoluteUrl = this.mediaService.getFileUrl(relativePath);
    this.selectedPreviewUrl.set(absoluteUrl);
    this.selectedPreviewTitle.set(title);
  }

  isPdfPreview(): boolean {
    return this.mediaService.isPdf(this.selectedPreviewUrl());
  }

  basculerPleinEcran() {
    this.isFullScreen.update((val) => !val);
  }

  chargerAgence(id: number) {
    this.isLoading.set(true);
    this.agenceService.getAgenceById(id).subscribe({
      next: (data: AgenceAdminDetails | null | undefined) => {
        this.agence.set(data);
        if (data?.motifRejet) {
          this.motifRejetInput.set(data.motifRejet);
        }

        if (data?.rccmDocumentUrl) {
          this.initialiserPreview(
            data.rccmDocumentUrl,
            'Registre de Commerce (RCCM) - ' + data.rccm,
          );
        } else if (data?.nifDocumentUrl) {
          this.initialiserPreview(
            data.nifDocumentUrl,
            'Identification Fiscale (NIF) - ' + (data.nif || 'N/A'),
          );
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement agence:', err);
        this.errorMessage.set('Impossible de charger les détails de cette agence.');
        this.isLoading.set(false);
      },
    });
  }

  validerAgence() {
    const current = this.agence();
    if (!current) return;

    this.isSubmitting.set(true);
    this.agenceService.validerDemande(current.id).subscribe({
      next: (updated) => {
        this.isSubmitting.set(false);
        this.agence.set(updated);
        this.successMessage.set(`L'agence "${updated.nomAgence}" a été validée avec succès.`);
        this.errorMessage.set(null);
        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set("Erreur lors de la validation de l'agence.");
      },
    });
  }

  ouvrirModalRejet(): void {
    this.modalErrorMessage.set('');
    this.motifRejetInput.set('');
    this.showRejectModal.set(true);
  }

  fermerModalRejet(): void {
    if (this.isSubmitting()) return;
    this.modalErrorMessage.set('');
    this.showRejectModal.set(false);
  }

  onMotifInputChange(value: string): void {
    this.motifRejetInput.set(value);
    if (this.modalErrorMessage() && value.trim().length > 0) {
      this.modalErrorMessage.set('');
    }
  }

  confirmerRejet(): void {
    const current = this.agence();
    const motif = this.motifRejetInput().trim();

    if (!current) {
      this.modalErrorMessage.set("Identifiant de l'agence introuvable.");
      return;
    }

    if (!motif) {
      this.modalErrorMessage.set('Veuillez saisir un motif de rejet obligatoire.');
      return;
    }

    this.isSubmitting.set(true);
    this.modalErrorMessage.set('');

    this.agenceService.rejeterDemande(current.id, motif).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.agence.set({
          ...current,
          userStatut: 'REJETE',
          motifRejet: motif,
          isVerifier: true,
        });

        this.showRejectModal.set(false);
        this.successMessage.set(response.message || 'La demande a été rejetée.');
        this.errorMessage.set(null);

        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const backendError =
          err.error?.message || err.error?.error || "Erreur lors du rejet de l'agence.";
        this.modalErrorMessage.set(backendError);
      },
    });
  }
}