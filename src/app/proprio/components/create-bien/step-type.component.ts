import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROPERTY_TYPES, PropertyType, PropertyTypeConfig } from './config/property.config';

@Component({
  selector: 'app-step-type',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4 max-w-4xl mx-auto animate-in">
      
      <!-- En-tête responsive -->
      <div class="text-center max-w-md mx-auto space-y-1 px-2">
        <div class="hidden sm:block space-y-1">
          <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Quel type de bien souhaitez-vous publier ?
          </h2>
          <p class="text-xs text-slate-500 dark:text-white/60">
            Sélectionnez la catégorie pour personnaliser le formulaire selon vos besoins.
          </p>
        </div>

        <div class="block sm:hidden space-y-0.5">
          <h2 class="text-sm font-black text-slate-900 dark:text-white tracking-tight">
            Quel type de bien publier ?
          </h2>
          <p class="text-[10px] text-slate-500 dark:text-white/60">Sélectionnez une catégorie pour continuer.</p>
        </div>
      </div>

      <!-- 1. VERSION MOBILE : Liste verticale (Style Radio Card comme sur l'image) -->
      <div class="block sm:hidden space-y-2.5 pt-1">
        @for (typeConfig of types; track typeConfig.id) {
          <button
            type="button"
            (click)="onSelect(typeConfig.id)"
            [class]="
              selectedType() === typeConfig.id
                ? 'border-brand bg-gradient-to-r from-brand/10 via-brand/5 to-transparent dark:from-brand/20 dark:via-brand/10 dark:to-transparent ring-2 ring-brand shadow-sm'
                : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-brand/40'
            "
            class="w-full group relative p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 shadow-2xs"
          >
            <div class="flex items-center gap-3 min-w-0">
              <!-- Icône -->
              <div
                [class]="
                  selectedType() === typeConfig.id
                    ? 'bg-brand text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white'
                "
                class="p-2.5 rounded-xl transition-colors duration-200 shrink-0"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="typeConfig.iconPath" />
                </svg>
              </div>

              <!-- Texte (Titre + Description) -->
              <div class="space-y-0.5 min-w-0">
                <p class="font-black text-xs text-slate-900 dark:text-white truncate">
                  {{ typeConfig.label }}
                </p>
                <p class="text-[11px] text-slate-500 dark:text-white/60 truncate">
                  {{ typeConfig.description }}
                </p>
              </div>
            </div>

            <!-- Indicateur de sélection mobile -->
            <div class="shrink-0 pl-2">
              @if (selectedType() === typeConfig.id) {
                <div class="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shadow-xs">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              } @else {
                <div class="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-white/20"></div>
              }
            </div>
          </button>
        }
      </div>

      <!-- 2. VERSION TABLETTE & PC : Grille moderne et élégante -->
      <div class="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-1">
        @for (typeConfig of types; track typeConfig.id) {
          <button
            type="button"
            (click)="onSelect(typeConfig.id)"
            [class]="
              selectedType() === typeConfig.id
                ? 'border-brand bg-gradient-to-tl from-brand/20 via-brand/5 to-transparent dark:from-brand/30 dark:via-brand/10 dark:to-transparent ring-2 ring-brand scale-[1.01] shadow-md'
                : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-brand/50 hover:bg-slate-50 dark:hover:bg-white/10'
            "
            class="group relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] shadow-xs overflow-hidden"
          >
            <!-- Icône Desktop -->
            <div class="flex items-center justify-between w-full">
              <div
                [class]="
                  selectedType() === typeConfig.id
                    ? 'bg-brand text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white group-hover:bg-brand group-hover:text-white'
                "
                class="p-3 rounded-xl transition-colors duration-200 w-max"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="typeConfig.iconPath" />
                </svg>
              </div>

              <!-- Petit indicateur discret sur bureau -->
              @if (selectedType() === typeConfig.id) {
                <div class="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              }
            </div>

            <!-- Texte Desktop -->
            <div class="space-y-1 mt-3">
              <p class="font-black text-sm text-slate-900 dark:text-white leading-tight">
                {{ typeConfig.label }}
              </p>
              <p class="text-[11px] text-slate-500 dark:text-white/60 line-clamp-2">
                {{ typeConfig.description }}
              </p>
            </div>
          </button>
        }
      </div>

    </div>
  `,
})
export class StepTypeComponent {
  readonly selectedType = input<PropertyType | null>(null);
  readonly typeSelected = output<PropertyType>();

  types: PropertyTypeConfig[] = PROPERTY_TYPES;

  onSelect(type: PropertyType): void {
    this.typeSelected.emit(type);
  }
}