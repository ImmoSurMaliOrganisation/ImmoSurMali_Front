import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PropertyTypeConfig } from './config/property.config';

@Component({
  selector: 'app-step-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="space-y-5 max-w-2xl mx-auto animate-in">
      
      <!-- Badge de rappel du type choisi -->
      @if (currentTypeConfig) {
        <div class="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
          <span class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Type sélectionné : {{ currentTypeConfig.label }}
          </span>
        </div>
      }

      <!-- Choix du Type de Transaction -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-slate-900 dark:text-white">
          Type de transaction <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-3 gap-2.5">
          
          <!-- Option Location -->
          <button 
            type="button" 
            (click)="setTransaction('LOCATION')"
            [class]="isTransaction('LOCATION') 
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-md scale-[1.02]' 
              : 'bg-white dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-white'"
            class="py-3 px-3 rounded-2xl border text-xs font-black transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-95">
            @if (isTransaction('LOCATION')) {
              <span class="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900"></span>
            }
            Location
          </button>

          <!-- Option Vente -->
          <button 
            type="button" 
            (click)="setTransaction('VENTE')"
            [class]="isTransaction('VENTE') 
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-md scale-[1.02]' 
              : 'bg-white dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-white'"
            class="py-3 px-3 rounded-2xl border text-xs font-black transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-95">
            @if (isTransaction('VENTE')) {
              <span class="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900"></span>
            }
            Vente
          </button>

          <!-- Option Saisonnier -->
          <button 
            type="button" 
            (click)="setTransaction('SAISONNIER')"
            [class]="isTransaction('SAISONNIER') 
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-md scale-[1.02]' 
              : 'bg-white dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-white'"
            class="py-3 px-3 rounded-2xl border text-xs font-black transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-95">
            @if (isTransaction('SAISONNIER')) {
              <span class="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900"></span>
            }
            Saisonnier
          </button>

        </div>
      </div>

      <!-- Titre de l'annonce -->
      <div class="space-y-1">
        <label for="titre" class="text-xs font-bold text-slate-900 dark:text-white">Titre de l'annonce <span class="text-red-500">*</span></label>
        <input 
          id="titre"
          type="text" 
          formControlName="titre"
          [placeholder]="'Ex: Superbe ' + (currentTypeConfig?.label?.toLowerCase() || 'bien') + ' à ACI 2000...'"
          class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/20 transition-all"
        />
      </div>

      <!-- Prix Dynamique & Surface Habitable -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="space-y-1">
          <label for="prix" class="text-xs font-bold text-slate-900 dark:text-white">
            {{ getPrixLabel() }} <span class="text-red-500">*</span>
          </label>
          <input 
            id="prix"
            type="number" 
            formControlName="prix"
            [placeholder]="getPrixPlaceholder()"
            class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/20 transition-all"
          />
        </div>

        <div class="space-y-1">
          <label for="surfaceHabitable" class="text-xs font-bold text-slate-900 dark:text-white">
            {{ currentTypeConfig?.category === 'TERRAIN' ? 'Surface exploitable (m²)' : 'Surface habitable (m²)' }}
          </label>
          <input 
            id="surfaceHabitable"
            type="number" 
            formControlName="surfaceHabitable"
            placeholder="Ex: 120"
            class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/20 transition-all"
          />
        </div>
      </div>

      <!-- Bloc Optionnel pour Charges et Caution -->
      <details class="group pt-1">
        <summary class="text-xs font-bold text-slate-900 dark:text-white cursor-pointer select-none hover:underline flex items-center gap-1">
          <span>+ Ajouter caution ou frais annexes (optionnel)</span>
        </summary>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
          <div class="space-y-1">
            <label for="caution" class="text-[11px] font-semibold text-slate-500 dark:text-white/70">Caution (FCFA)</label>
            <input 
              id="caution"
              type="number" 
              formControlName="caution"
              placeholder="Ex: 500000"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white shadow-xs focus:outline-none focus:border-slate-900 dark:focus:border-white"
            />
          </div>
          <div class="space-y-1">
            <label for="fraisSyndic" class="text-[11px] font-semibold text-text-muted dark:text-white/70">Frais de syndic / Charges (FCFA)</label>
            <input 
              id="fraisSyndic"
              type="number" 
              formControlName="fraisSyndic"
              placeholder="Ex: 25000"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white shadow-xs focus:outline-none focus:border-slate-900 dark:focus:border-white"
            />
          </div>
        </div>
      </details>

      <!-- Description -->
      <div class="space-y-1">
        <label for="description" class="text-xs font-bold text-slate-900 dark:text-white">Description détaillée</label>
        <textarea 
          id="description"
          rows="5" 
          formControlName="description"
          placeholder="Décrivez l'état du bien, le quartier, les équipements inclus..."
          class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-xs focus:outline-none focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/20 transition-all"
        ></textarea>
      </div>

    </div>
  `
})
export class StepGeneralComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() currentTypeConfig: PropertyTypeConfig | null = null;

  setTransaction(type: string): void {
    this.form.patchValue({ typeTransaction: type });
  }

  isTransaction(type: string): boolean {
    return this.form.get('typeTransaction')?.value === type;
  }

  getPrixLabel(): string {
    const type = this.form.get('typeTransaction')?.value || 'LOCATION';
    if (type === 'VENTE') return 'Prix de vente (FCFA)';
    if (type === 'SAISONNIER') return 'Prix par nuit (FCFA)';
    return 'Loyer mensuel (FCFA)';
  }

  getPrixPlaceholder(): string {
    const type = this.form.get('typeTransaction')?.value || 'LOCATION';
    if (type === 'VENTE') return 'Ex: 75000000';
    if (type === 'SAISONNIER') return 'Ex: 35000';
    return 'Ex: 250000';
  }
}