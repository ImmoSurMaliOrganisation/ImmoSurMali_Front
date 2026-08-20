import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-1.5 md:space-y-2">
      <label class="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">
        {{ label() }}
      </label>
      <input
        [type]="type()"
        [formControl]="formControl"
        [readonly]="readonly()"
        [placeholder]="placeholder()"
        class="w-full px-5 py-3.5 md:px-6 md:py-5 rounded-2xl md:rounded-[2rem] bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-brand/30 outline-none font-bold dark:text-white text-base md:text-lg transition-all"
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
