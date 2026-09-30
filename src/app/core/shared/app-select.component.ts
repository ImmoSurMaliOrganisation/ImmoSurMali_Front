import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
  description?: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppSelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative w-full">
      <!-- Bouton déclencheur du select custom -->
      <button 
        type="button"
        (click)="toggleDropdown($event)"
        [disabled]="disabled"
        class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-left text-slate-900 dark:text-white flex items-center justify-between shadow-xs focus:outline-none focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/25 transition-all cursor-pointer disabled:opacity-50">
        
        <span [class.text-slate-400]="!selectedOption()" [class.dark:text-white/40]="!selectedOption()">
          {{ selectedOption() ? selectedOption()?.label : placeholder }}
        </span>

        <!-- Icône flèche -->
        <svg class="w-4 h-4 text-slate-400 dark:text-white/40 transition-transform duration-200" [class.rotate-180]="isOpen()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Liste déroulante -->
      @if (isOpen()) {
        <!-- Overlay pour fermer au clic extérieur (empèche la propagation immédiate) -->
        <div class="fixed inset-0 z-40" (click)="closeDropdown($event)"></div>

        <div class="absolute z-50 w-full mt-2 bg-white dark:bg-[#1A1A1A] border border-slate-300 dark:border-white/15 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div class="max-h-60 overflow-y-auto p-1.5 space-y-1">
            @for (option of options; track option.value) {
              <div 
                (click)="selectOption(option, $event)"
                class="px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between"
                [class.bg-slate-900]="selectedOption()?.value === option.value"
                [class.text-white]="selectedOption()?.value === option.value"
                [class.dark:bg-white]="selectedOption()?.value === option.value"
                [class.dark:text-slate-900]="selectedOption()?.value === option.value"
                [class.text-slate-900]="selectedOption()?.value !== option.value"
                [class.dark:text-white]="selectedOption()?.value !== option.value"
                [class.hover:bg-slate-100]="selectedOption()?.value !== option.value"
                [class.dark:hover:bg-white/5]="selectedOption()?.value !== option.value">
                
                <span>{{ option.label }}</span>

                @if (selectedOption()?.value === option.value) {
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class AppSelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Sélectionner une option';

  isOpen = signal<boolean>(false);
  selectedOption = signal<SelectOption | null>(null);
  disabled = false;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  toggleDropdown(event: Event) {
    event.stopPropagation();
    if (!this.disabled) {
      this.isOpen.update(v => !v);
      if (this.isOpen()) {
        this.onTouched();
      }
    }
  }

  closeDropdown(event: Event) {
    event.stopPropagation();
    this.isOpen.set(false);
  }

  selectOption(option: SelectOption, event: Event) {
    event.stopPropagation();
    this.selectedOption.set(option);
    this.isOpen.set(false);
    this.onChange(option.value);
    this.onTouched();
  }

  // Implémentation ControlValueAccessor
  writeValue(value: any): void {
    const found = this.options.find(o => o.value === value);
    this.selectedOption.set(found || null);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}