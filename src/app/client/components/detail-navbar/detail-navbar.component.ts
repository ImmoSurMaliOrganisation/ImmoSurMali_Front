import { Component, inject, computed, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import {
  LucideArrowLeft,
  LucideCalendarCheck,
  LucideMoon,
  LucideSun,
} from '@lucide/angular';

@Component({
  selector: 'app-detail-navbar',
  standalone: true,
  imports: [LucideMoon, LucideSun, LucideCalendarCheck, LucideArrowLeft],
  templateUrl: './detail-navbar.component.html',
})
export class DetailNavbarComponent {
  private router = inject(Router);
  private location = inject(Location);
  isDark = signal(false);

  // Signal qui traque l'URL actuelle
  private url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: any) => event.url),
    ),
  );

  isDetailsPage = computed(() => this.url()?.includes('/property/'));

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/properties']);
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }
  toggleDarkMode() {
    this.isDark.update((v) => !v);
    document.documentElement.classList.toggle('dark');
  }

  scrollToBooking() {
    const element = document.getElementById('booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
