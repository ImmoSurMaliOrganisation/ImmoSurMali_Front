import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      (click)="onClick.emit($event)"
      [class]="buttonClasses">
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  fullWidth = input<boolean>(false);
  disabled = input<boolean>(false);

  onClick = output<MouseEvent>();

  get buttonClasses(): string {
    const base = 'font-black rounded-2xl transition-all cursor-pointer active:scale-[0.98] inline-flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';
    
    // Tailles agrandies sur desktop via md:
    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-xs md:px-5 md:py-2.5 md:text-sm',
      md: 'px-5 py-3 text-sm md:px-7 md:py-4 md:text-base',   // <-- Taille par défaut plus grande sur desktop
      lg: 'px-6 py-3.5 text-base md:px-9 md:py-5 md:text-lg'
    };

    // Variantes de style
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-main-text dark:bg-brand text-white shadow-md shadow-brand/20 hover:opacity-90',
      secondary: 'bg-slate-100 dark:bg-white/10 text-main-text dark:text-white hover:bg-slate-200 dark:hover:bg-white/20',
      outline: 'border-2 border-main-text dark:border-white/20 text-main-text dark:text-white hover:bg-main-text hover:text-white dark:hover:bg-brand dark:hover:border-brand',
      danger: 'border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-600',
      ghost: 'text-text-muted hover:text-main-text dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
    };

    const width = this.fullWidth() ? 'w-full' : 'w-full md:w-auto';

    return `${base} ${sizes[this.size()]} ${variants[this.variant()]} ${width}`;
  }
}