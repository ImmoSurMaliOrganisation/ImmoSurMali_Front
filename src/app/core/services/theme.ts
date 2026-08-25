import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public isDark = signal(false);
  public toggleDarkMode() {
    this.isDark.update((v) => !v);
    document.documentElement.classList.toggle('dark');
  }
}
