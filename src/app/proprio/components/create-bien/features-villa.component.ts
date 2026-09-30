import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-features-villa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="space-y-4 max-w-4xl mx-auto animate-in">
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label for="surfaceTerrain" class="text-xs font-bold text-main-text dark:text-white">Surface terrain (m²)</label>
          <input 
            id="surfaceTerrain"
            type="number" 
            formControlName="surfaceTerrain"
            placeholder="Ex: 500"
            class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-border/50 text-xs text-main-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div class="space-y-1">
          <label for="nombreFacades" class="text-xs font-bold text-main-text dark:text-white">Nombre de façades</label>
          <input 
            id="nombreFacades"
            type="number" 
            formControlName="nombreFacades"
            placeholder="Ex: 2"
            class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-border/50 text-xs text-main-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div class="space-y-1">
        <label for="nombreChambres" class="text-xs font-bold text-main-text dark:text-white">Nombre de chambres</label>
        <input 
          id="nombreChambres"
          type="number" 
          formControlName="nombreChambres"
          placeholder="Ex: 4"
          class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-border/50 text-xs text-main-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div class="space-y-2 pt-2">
        <label class="text-xs font-black text-main-text dark:text-white uppercase tracking-wider">Équipements Villa</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <label class="p-3.5 rounded-2xl border border-border/60 bg-white dark:bg-[#1A1A1A] flex items-center justify-between cursor-pointer">
            <span class="text-xs font-bold text-main-text dark:text-white">Jardin</span>
            <input type="checkbox" formControlName="jardin" class="w-4 h-4 accent-brand rounded" />
          </label>
          <label class="p-3.5 rounded-2xl border border-border/60 bg-white dark:bg-[#1A1A1A] flex items-center justify-between cursor-pointer">
            <span class="text-xs font-bold text-main-text dark:text-white">Piscine</span>
            <input type="checkbox" formControlName="piscine" class="w-4 h-4 accent-brand rounded" />
          </label>
          <label class="p-3.5 rounded-2xl border border-border/60 bg-white dark:bg-[#1A1A1A] flex items-center justify-between cursor-pointer">
            <span class="text-xs font-bold text-main-text dark:text-white">Garage</span>
            <input type="checkbox" formControlName="garage" class="w-4 h-4 accent-brand rounded" />
          </label>
        </div>
      </div>
    </div>
  `
})
export class FeaturesVillaComponent {
  @Input({ required: true }) form!: FormGroup;
}