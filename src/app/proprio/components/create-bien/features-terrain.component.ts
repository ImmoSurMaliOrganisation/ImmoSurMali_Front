import { Component, input, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppSelectComponent, SelectOption } from '../../../core/shared/app-select.component';

@Component({
  selector: 'app-features-terrain',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppSelectComponent],
  template: `
    <div [formGroup]="form()" class="space-y-4 max-w-4xl mx-auto animate-in">
      

      <!-- Type de terrain et Superficie Totale -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-900 dark:text-white">
            Type de terrain <span class="text-red-500">*</span>
          </label>
          <app-select 
            [formControlName]="'typeTerrain'"
            [options]="terrainTypes"
            [placeholder]="'Sélectionner le type de terrain'">
          </app-select>
        </div>

        <div class="space-y-1">
          <label for="superficieTotale" class="text-xs font-bold text-slate-900 dark:text-white">
            Superficie totale (m²) <span class="text-red-500">*</span>
          </label>
          <input 
            id="superficieTotale"
            type="number" 
            formControlName="superficieTotale"
            placeholder="Ex: 500"
            class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/20 transition-all"
          />
        </div>
      </div>

      <!-- Nombre de façades et Zonage -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="space-y-1">
          <label for="nombreFacades" class="text-xs font-bold text-slate-900 dark:text-white">Nombre de façades</label>
          <input 
            id="nombreFacades"
            type="number" 
            formControlName="nombreFacades"
            placeholder="Ex: 1"
            class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/20 transition-all"
          />
        </div>

        <div class="space-y-1">
          <label for="zonage" class="text-xs font-bold text-slate-900 dark:text-white">Zonage</label>
          <input 
            id="zonage"
            type="text" 
            formControlName="zonage"
            placeholder="Ex: R+2, Villa..."
            class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/20 transition-all"
          />
        </div>
      </div>

      <!-- Équipements / Caractéristiques du Terrain (Checkboxes) -->
      <div class="space-y-2 pt-2">
        <label class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Caractéristiques & Viabilité</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          <label class="p-3.5 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#1A1A1A] flex items-center justify-between cursor-pointer">
            <span class="text-xs font-bold text-slate-900 dark:text-white">Viabilité</span>
            <input type="checkbox" formControlName="viabilise" class="w-4 h-4 accent-slate-900 dark:accent-white rounded" />
          </label>

          <label class="p-3.5 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#1A1A1A] flex items-center justify-between cursor-pointer">
            <span class="text-xs font-bold text-slate-900 dark:text-white">Clôture</span>
            <input type="checkbox" formControlName="cloture" class="w-4 h-4 accent-slate-900 dark:accent-white rounded" />
          </label>

          <label class="p-3.5 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#1A1A1A] flex items-center justify-between cursor-pointer">
            <span class="text-xs font-bold text-slate-900 dark:text-white">Titre foncier</span>
            <input type="checkbox" formControlName="titreFoncier" class="w-4 h-4 accent-slate-900 dark:accent-white rounded" />
          </label>

          <label class="p-3.5 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#1A1A1A] flex items-center justify-between cursor-pointer">
            <span class="text-xs font-bold text-slate-900 dark:text-white">Eau</span>
            <input type="checkbox" formControlName="eau" class="w-4 h-4 accent-slate-900 dark:accent-white rounded" />
          </label>

          <label class="p-3.5 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#1A1A1A] flex items-center justify-between cursor-pointer">
            <span class="text-xs font-bold text-slate-900 dark:text-white">Électricité</span>
            <input type="checkbox" formControlName="electricite" class="w-4 h-4 accent-slate-900 dark:accent-white rounded" />
          </label>

          <label class="p-3.5 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#1A1A1A] flex items-center justify-between cursor-pointer">
            <span class="text-xs font-bold text-slate-900 dark:text-white">Accès goudronné</span>
            <input type="checkbox" formControlName="accesGoudronne" class="w-4 h-4 accent-slate-900 dark:accent-white rounded" />
          </label>

          <label class="p-3.5 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#1A1A1A] flex items-center justify-between cursor-pointer col-span-2 sm:col-span-1">
            <span class="text-xs font-bold text-slate-900 dark:text-white">Assainissement</span>
            <input type="checkbox" formControlName="assainissement" class="w-4 h-4 accent-slate-900 dark:accent-white rounded" />
          </label>

        </div>
      </div>
    </div>
  `
})
export class FeaturesTerrainComponent {
  readonly form = input.required<FormGroup>();

  terrainTypes: SelectOption[] = [
    { label: 'Constructible', value: 'CONSTRUCTIBLE' },
    { label: 'Agricole', value: 'AGRICOLE' },
    { label: 'Industriel', value: 'INDUSTRIEL' },
    { label: 'Commercial', value: 'COMMERCIAL' }
  ];
}