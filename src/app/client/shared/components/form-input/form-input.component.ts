import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-1.5">
      <label class="block text-[11px] font-black uppercase tracking-wider text-text-muted ml-1">
        {{ label() }}
      </label>
      <input
        [type]="type()"
        [formControl]="formControl"
        [readonly]="readonly()"
        [placeholder]="placeholder()"
        class="w-full px-5 py-3 md:px-7 md:py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border/60 text-main-text dark:text-white placeholder-text-muted/50 font-bold text-sm md:text-base outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20 transition-all"
      />
    </div>
  `,
})
export class FormInputComponent {
  label = input.required<string>();
  control = input.required<AbstractControl>();

  type = input<string>('text');
  placeholder = input<string>('');
  readonly = input<boolean>(false);

  get formControl(): FormControl {
    return this.control() as FormControl;
  }
}