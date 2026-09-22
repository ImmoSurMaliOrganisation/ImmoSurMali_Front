import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ImagePreview {
  file: File;
  url: string;
}

@Component({
  selector: 'app-step-media',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4 max-w-4xl mx-auto animate-in">
      
      <label class="text-xs font-black text-main-text dark:text-white uppercase tracking-wider">
        Photos du bien
      </label>

      <!-- Zone de Drop / Upload -->
      <div class="relative border-2 border-dashed border-border/80 dark:border-white/20 hover:border-brand rounded-3xl p-6 text-center bg-slate-50 dark:bg-white/5 transition-all cursor-pointer">
        <input 
          type="file" 
          multiple 
          accept="image/*"
          (change)="onFilesSelected($event)"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div class="space-y-2 pointer-events-none">
          <span class="mx-auto inline-flex p-3 rounded-2xl bg-brand/10 text-brand">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <p class="text-xs font-black text-main-text dark:text-white">Ajouter des photos</p>
          <p class="text-[10px] text-text-muted">Glissez vos fichiers ou cliquez ici</p>
        </div>
      </div>

      <!-- Grille de prévisualisation -->
      @if (previews.length > 0) {
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          @for (preview of previews; track preview.url; let i = $index) {
            <div class="relative rounded-2xl overflow-hidden aspect-4/3 group border border-border/50 shadow-sm">
              <img [src]="preview.url" alt="Aperçu" class="w-full h-full object-cover" />
              
              @if (i === 0) {
                <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand text-white text-[9px] font-black shadow-sm">
                  Couverture
                </span>
              }

              <button 
                type="button" 
                (click)="removeImage(i)"
                class="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-brand transition-all cursor-pointer">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          }
        </div>
      }

      <!-- Message d'erreur -->
      @if (errorMessage) {
        <div class="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold">
          {{ errorMessage }}
        </div>
      }

    </div>
  `
})
export class StepMediaComponent {
  @Input() previews: ImagePreview[] = [];
  @Input() errorMessage: string | null = null;

  @Output() filesChanged = new EventEmitter<Event>();
  @Output() imageRemoved = new EventEmitter<number>();

  onFilesSelected(event: Event): void {
    this.filesChanged.emit(event);
  }

  removeImage(index: number): void {
    this.imageRemoved.emit(index);
  }
}