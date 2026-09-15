import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-features-appartement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="space-y-5 max-w-2xl mx-auto animate-in">
      
      <!-- Titre de section -->
      <div class="pb-2 border-b border-slate-200 dark:border-white/10">
        <h3 class="text-xs font-black uppercase tracking-wider text-brand">
          Caractéristiques de l'appartement
        </h3>
      </div>

      <!-- Champs Numériques (Étage, Chambres, Syndic) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="space-y-1.5">
          <label for="etage" class="text-xs font-bold text-main-text dark:text-white">Étage</label>
          <input 
            id="etage"
            type="number" 
            formControlName="etage"
            placeholder="Ex: 3"
            class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-main-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>

        <div class="space-y-1.5">
          <label for="nombreChambres" class="text-xs font-bold text-main-text dark:text-white">Nombre de chambres</label>
          <input 
            id="nombreChambres"
            type="number" 
            formControlName="nombreChambres"
            placeholder="Ex: 2"
            class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-main-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>

        <div class="space-y-1.5">
          <label for="fraisSyndic" class="text-xs font-bold text-main-text dark:text-white">Frais de syndic (DH)</label>
          <input 
            id="fraisSyndic"
            type="number" 
            formControlName="fraisSyndic"
            placeholder="Ex: 300"
            class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-main-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>
      </div>

      <!-- Équipements & Prestations (Checkboxes stylisées) -->
      <div class="space-y-2">
        <label class="text-xs font-bold text-main-text dark:text-white">Équipements & Prestations</label>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          <!-- Ascenseur -->
          <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 cursor-pointer hover:border-brand/50 transition-all shadow-xs">
            <input 
              type="checkbox" 
              formControlName="ascenseur"
              class="w-4 h-4 rounded border-slate-300 accent-brand cursor-pointer"
            />
            <span class="text-xs font-semibold text-main-text dark:text-white">Ascenseur</span>
          </label>

          <!-- Balcon / Terrasse -->
          <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 cursor-pointer hover:border-brand/50 transition-all shadow-xs">
            <input 
              type="checkbox" 
              formControlName="balcon"
              class="w-4 h-4 rounded border-slate-300 accent-brand cursor-pointer"
            />
            <span class="text-xs font-semibold text-main-text dark:text-white">Balcon / Terrasse</span>
          </label>

          <!-- Garage / Parking -->
          <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 cursor-pointer hover:border-brand/50 transition-all shadow-xs">
            <input 
              type="checkbox" 
              formControlName="garage"
              class="w-4 h-4 rounded border-slate-300 accent-brand cursor-pointer"
            />
            <span class="text-xs font-semibold text-main-text dark:text-white">Parking / Garage</span>
          </label>

          <!-- Meublé -->
          <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 cursor-pointer hover:border-brand/50 transition-all shadow-xs">
            <input 
              type="checkbox" 
              formControlName="meuble"
              class="w-4 h-4 rounded border-slate-300 accent-brand cursor-pointer"
            />
            <span class="text-xs font-semibold text-main-text dark:text-white">Meublé</span>
          </label>

          <!-- Climatisation -->
          <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 cursor-pointer hover:border-brand/50 transition-all shadow-xs">
            <input 
              type="checkbox" 
              formControlName="climatisation"
              class="w-4 h-4 rounded border-slate-300 accent-brand cursor-pointer"
            />
            <span class="text-xs font-semibold text-main-text dark:text-white">Climatisation</span>
          </label>

          <!-- Concierge / Sécurité -->
          <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 cursor-pointer hover:border-brand/50 transition-all shadow-xs">
            <input 
              type="checkbox" 
              formControlName="securite"
              class="w-4 h-4 rounded border-slate-300 accent-brand cursor-pointer"
            />
            <span class="text-xs font-semibold text-main-text dark:text-white">Concierge / Sécurité</span>
          </label>

        </div>
      </div>

    </div>
  `
})
export class FeaturesAppartementComponent {
  @Input({ required: true }) form!: FormGroup;
}