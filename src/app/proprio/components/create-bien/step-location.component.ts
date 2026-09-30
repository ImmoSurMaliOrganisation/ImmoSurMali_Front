import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-location',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="space-y-4 max-w-4xl mx-auto animate-in">
      
      <!-- Ville & Quartier -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="ville" class="text-xs font-bold text-main-text dark:text-white">Ville</label>
          <input 
            id="ville"
            type="text" 
            formControlName="ville"
            placeholder="Ex: Casablanca"
            class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-main-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>

        <div class="space-y-1.5">
          <label for="quartier" class="text-xs font-bold text-main-text dark:text-white">Quartier</label>
          <input 
            id="quartier"
            type="text" 
            formControlName="quartier"
            placeholder="Ex: Gauthier"
            class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-main-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>
      </div>

      <!-- Adresse complète -->
      <div class="space-y-1.5">
        <label for="adresse" class="text-xs font-bold text-main-text dark:text-white">Adresse complète</label>
        <input 
          id="adresse"
          type="text" 
          formControlName="adresse"
          placeholder="Ex: 12, Rue Jules Ferry"
          class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-main-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
        />
      </div>

      <!-- Coordonnées GPS (Boîte conteneur à fort contraste) -->
      <div class="p-4 rounded-3xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 shadow-xs space-y-3">
        <p class="text-xs font-black text-main-text dark:text-white">Coordonnées GPS (Optionnel)</p>
        
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label for="latitude" class="text-[11px] font-semibold text-text-muted">Latitude</label>
            <input 
              id="latitude"
              type="number" 
              step="any"
              formControlName="latitude"
              placeholder="33.5731"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-main-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>

          <div class="space-y-1">
            <label for="longitude" class="text-[11px] font-semibold text-text-muted">Longitude</label>
            <input 
              id="longitude"
              type="number" 
              step="any"
              formControlName="longitude"
              placeholder="-7.5898"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-main-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>
        </div>
      </div>

    </div>
  `
})
export class StepLocationComponent {
  @Input({ required: true }) form!: FormGroup;
}