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

  // Injection du service média
  public mediaService = inject(MediaService);

  // Signaux pour la visionneuse
  selectedPreviewUrl = signal<string | null>(null);
  selectedPreviewTitle = signal<string>('');
  isFullScreen = signal<boolean>(false);

  agence = signal<AgenceAdminDetails | null | undefined>(null);
  isLoading = signal<boolean>(true);

  // Messages & Modale de rejet
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showRejectModal = signal<boolean>(false);
  motifRejetInput = signal<string>('');

  safePreviewUrl = computed(() => this.selectedPreviewUrl() ?? '');

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.chargerAgence(+idParam);
    }
  }

  // Méthode pour initialiser l'aperçu avec l'URL formatée par le service
  initialiserPreview(relativePath: string | null | undefined, title: string) {
    if (!relativePath) return;

    const absoluteUrl = this.mediaService.getFileUrl(relativePath);
    this.selectedPreviewUrl.set(absoluteUrl);
    this.selectedPreviewTitle.set(title);
  }

  // Vérifie si le fichier affiché est un PDF
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
        console.log(data);
        
        this.agence.set(data);
        if (data?.motifRejet) {
          this.motifRejetInput.set(data.motifRejet);
        }

        // CHARGEMENT AUTOMATIQUE PAR DÉFAUT DU RCCM (ou NIF si RCCM absent)
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

        console.log(data);
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

    this.agenceService.validerDemande(current.id).subscribe({
      next: (updated) => {
        this.agence.set(updated);
        this.successMessage.set(`L'agence "${updated.nomAgence}" a été validée avec succès.`);
        this.errorMessage.set(null);
        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: () => {
        this.errorMessage.set("Erreur lors de la validation de l'agence.");
      },
    });
  }

  confirmerRejet() {
    const current = this.agence();
    const motif = this.motifRejetInput().trim();

    if (!current) return;
    if (!motif) {
      alert('Veuillez saisir un motif de rejet obligatoire.');
      return;
    }

    this.agenceService.rejeterDemande(current.id, motif).subscribe({
      next: (updated) => {
        this.agence.set(updated);
        this.showRejectModal.set(false);
        this.successMessage.set(`L'agence a été rejetée.`);
        this.errorMessage.set(null);
        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: () => {
        this.errorMessage.set("Erreur lors du rejet de l'agence.");
      },
    });
  }
}
