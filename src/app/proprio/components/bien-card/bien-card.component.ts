import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideBuilding2, LucideMapPin, LucideMaximize2 } from '@lucide/angular';

@Component({
  selector: 'app-bien-card',
  standalone: true,
  imports: [CommonModule, LucideBuilding2, LucideMapPin, LucideMaximize2],
  template: `
    <!-- ========================================== -->
    <!-- 1. VERSION MOBILE : DESIGN HORIZONTAL     -->
    <!-- ========================================== -->
    <div
      class="group block sm:hidden p-3 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-border/50 shadow-sm hover:border-brand/40 transition-all duration-300 cursor-pointer flex gap-3.5 items-center"
      (click)="cardClick.emit(bien())"
    >
      <!-- Image Miniature carrée à gauche -->
      <div class="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 shrink-0">
        @if (mainImageUrl()) {
        <img [src]="mainImageUrl()" [alt]="bien().titre"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        } @else {
        <div class="w-full h-full flex items-center justify-center text-text-muted">
          <svg lucideBuilding2 class="w-6 h-6 opacity-40"></svg>
        </div>
        }
      </div>

      <!-- Informations à droite -->
      <div class="flex-1 min-w-0 space-y-1.5">
        <!-- Type & Statut -->
        <div class="flex items-center justify-between gap-2">
          <span class="text-[10px] font-black uppercase tracking-wider text-brand bg-brand/10 px-2 py-0.5 rounded-md">
            {{ bien().type || 'Appartement' }}
          </span>
          <span
            [ngClass]="bien().statut === 'DISPONIBLE' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'"
            class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
            {{ bien().statut }}
          </span>
        </div>

        <!-- Titre -->
        <h3 class="font-black text-xs text-main-text dark:text-white truncate group-hover:text-brand transition-colors">
          {{ bien().titre }}
        </h3>

        <!-- Adresse -->
        <p class="text-[11px] text-text-muted truncate flex items-center gap-1.5">
          <svg lucideMapPin class="w-3.5 h-3.5 shrink-0 text-brand"></svg>
          <span class="truncate">{{ bien().quartier }}, {{ bien().ville }}</span>
        </p>

        <!-- Prix & Surface -->
        <div class="flex items-center justify-between pt-0.5 border-t border-border/30">
          <span class="text-xs font-black text-main-text dark:text-white">
            {{ bien().prix | number }} FCFA
          </span>
          @if (bien().surfaceHabitable) {
          <span class="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-lg text-[10px] text-text-muted">
            <svg lucideMaximize2 class="w-3 h-3 text-text-muted/70"></svg>
            {{ bien().surfaceHabitable }} m²
          </span>
          }
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 2. VERSION DESKTOP : DESIGN VERTICAL      -->
    <!-- ========================================== -->
    <div
      class="group hidden sm:flex p-3 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/50 shadow-sm hover:border-brand/40 transition-all duration-300 cursor-pointer flex-col space-y-3"
      (click)="cardClick.emit(bien())"
    >
      <!-- Image plein format en haut -->
      <div class="relative w-full h-52 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 shrink-0">
        @if (mainImageUrl()) {
        <img [src]="mainImageUrl()" [alt]="bien().titre"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        } @else {
        <div class="w-full h-full flex items-center justify-center text-text-muted">
          <svg lucideBuilding2 class="w-8 h-8 opacity-40"></svg>
        </div>
        }

        <!-- Badge Type -->
        <div class="absolute top-3 left-3">
          <span class="text-[10px] font-black uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm">
            {{ bien().type || 'Appartement' }}
          </span>
        </div>

        <!-- Badge Statut -->
        <div class="absolute top-3 right-3">
          <span
            [ngClass]="bien().statut === 'DISPONIBLE' ? 'text-emerald-500 bg-white/90 dark:bg-black/80' : 'text-amber-500 bg-white/90 dark:bg-black/80'"
            class="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
            {{ bien().statut }}
          </span>
        </div>
      </div>

      <!-- Informations -->
      <div class="flex-1 min-w-0 space-y-2 px-1">
        <h3 class="font-black text-sm text-main-text dark:text-white truncate group-hover:text-brand transition-colors">
          {{ bien().titre }}
        </h3>

        <p class="text-xs text-text-muted truncate flex items-center gap-1.5">
          <svg lucideMapPin class="w-3.5 h-3.5 shrink-0 text-brand"></svg>
          <span class="truncate">{{ bien().quartier }}, {{ bien().ville }}</span>
        </p>

        <div class="flex items-center gap-3 pt-1 text-[11px] text-text-muted font-bold">
          @if (bien().surfaceHabitable) {
          <span class="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-xl">
            <svg lucideMaximize2 class="w-3.5 h-3.5 text-text-muted/70"></svg>
            {{ bien().surfaceHabitable }} m²
          </span>
          }
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-border/30">
          <span class="text-base font-black text-main-text dark:text-white">
            {{ bien().prix | number }} FCFA <span class="text-[11px] text-text-muted font-normal">/ mois</span>
          </span>
        </div>
      </div>
    </div>
  `
})
export class BienCardComponent {
  readonly bien = input.required<any>();
  readonly mainImageUrl = input<string | null>(null);
  readonly cardClick = output<any>();
}