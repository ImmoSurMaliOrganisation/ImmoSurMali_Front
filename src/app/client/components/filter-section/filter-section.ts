import { Component, ElementRef, HostListener, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import {
  LucideSearch,
  LucideMap,
  LucideLayoutGrid,
  LucideSettings2,
  LucideLayers,
  LucideChevronDown,
} from '@lucide/angular';

@Component({
  selector: 'app-filter-section',
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    LucideSearch,
    LucideMap,
    LucideLayoutGrid,
    LucideSettings2,
    LucideLayers,
    LucideChevronDown,
  ],
  templateUrl: './filter-section.html',
})
export class FilterSection {
  // --- Signaux (Liaison Parent) ---
  searchQuery = model('');
  selectedCategory = model('All');
  maxPrice = model(1000000);
  minBeds = model(0);
  viewMode = model<'grid' | 'map'>('grid');
  showAdvanced = model(false);

  // --- Configuration ---
  readonly categories = ['All', 'Villa', 'Apartment', 'Land', 'Studio', 'Office'];

  // --- Actions ---
  onReset = output<void>();

  constructor(private eRef: ElementRef) {}
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.showAdvanced() && !this.eRef.nativeElement.contains(event.target)) {
      this.showAdvanced.set(false);
    }
  }

  updatePrice(event: Event) {
    const input = event.target as HTMLInputElement;
    this.maxPrice.set(Number(input.value));
  }

  reset() {
    this.searchQuery.set('');
    this.selectedCategory.set('All');
    this.maxPrice.set(1000000);
    this.minBeds.set(0);
    this.onReset.emit();
  }
}
