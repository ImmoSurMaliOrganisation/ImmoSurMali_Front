import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROPERTY_TYPES, PropertyType, PropertyTypeConfig } from './config/property.config';

@Component({
  selector: 'app-step-type',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4 animate-in">
      <div class="text-center max-w-md mx-auto space-y-1">
        <h2 class="text-lg sm:text-xl font-black text-main-text dark:text-white tracking-tight">
          Quel type de bien souhaitez-vous publier ?
        </h2>
        <p class="text-xs text-text-muted">
          Sélectionnez la catégorie correspondante pour personnaliser la suite du formulaire.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
        @for (typeConfig of types; track typeConfig.id) {
          <button 
            type="button"
            (click)="onSelect(typeConfig.id)"
            [class]="selectedType === typeConfig.id 
              ? 'border-brand bg-brand/10 dark:bg-brand/20 ring-2 ring-brand scale-[1.02] shadow-bento' 
              : 'border-border/60 bg-white dark:bg-[#1A1A1A] hover:border-brand/50 hover:bg-slate-50 dark:hover:bg-white/5'"
            class="group relative p-6 rounded-3xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[130px] sm:min-h-[140px] shadow-sm overflow-hidden">
            
            @if (selectedType === typeConfig.id) {
              <span class="absolute top-3 right-3 flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
              </span>
            }

            <div [class]="selectedType === typeConfig.id ? 'bg-brand text-white' : 'bg-slate-100 dark:bg-white/10 text-main-text dark:text-white group-hover:bg-brand group-hover:text-white'"
                 class="p-3 rounded-2xl w-max transition-colors duration-200 shadow-sm">
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="typeConfig.iconPath" />
              </svg>
            </div>

            <div class="space-y-0.5 mt-2">
              <p class="font-black text-xs sm:text-sm text-main-text dark:text-white leading-tight">
                {{ typeConfig.label }}
              </p>
              <p class="text-[10px] sm:text-[11px] text-text-muted line-clamp-2">
                {{ typeConfig.description }}
              </p>
            </div>
          </button>
        }
      </div>
    </div>
  `
})
export class StepTypeComponent {
  @Input() selectedType: PropertyType | null = null;
  @Output() typeSelected = new EventEmitter<PropertyType>();

  types: PropertyTypeConfig[] = PROPERTY_TYPES;

  onSelect(type: PropertyType): void {
    this.typeSelected.emit(type);
  }
}