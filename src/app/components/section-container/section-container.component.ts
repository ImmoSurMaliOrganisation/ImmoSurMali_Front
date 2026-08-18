import { Component, input, signal, viewChild, ElementRef, computed } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { PropertyCardSkeleton } from '../../shared/components/property-card/property-card-skeleton';

@Component({
  selector: 'app-section-container',
  standalone: true,
  imports: [LucideChevronLeft, LucideChevronRight, PropertyCardSkeleton],
  templateUrl: './section-container.component.html',
  styles: [
    `
      .no-scrollbar {
        scrollbar-width: none;
      }
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `,
  ],
})
export class SectionContainerComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  variant = input<'light' | 'dark' | 'brand'>('light'); // Pour changer le style

  items = input<any[]>([]);
  totalPages = computed(() => {
    const count = this.items().length;
    if (count === 0) return 0;

    const itemsPerPage = window.innerWidth > 768 ? 3 : 1;
    const actualPages = Math.ceil(count / itemsPerPage);

    // ON LIMITE À 10 MAXIMUM
    return Math.min(actualPages, 10);
  });

  skeletonCount = input<number>(3);
  skeletons = computed(() => Array(this.skeletonCount()).fill(0));

  isLoading = input<boolean>(false);

  currentPage = signal(1);
  scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollArea');

  move(direction: 'next' | 'prev') {
    const el = this.scrollContainer()?.nativeElement;
    if (!el) return;

    const scrollAmount = el.offsetWidth * 0.8;
    const sign = direction === 'next' ? 1 : -1;

    el.scrollBy({ left: scrollAmount * sign, behavior: 'smooth' });
  }

  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const progress = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    const page = Math.round(progress * (this.totalPages() - 1)) + 1;
    this.currentPage.set(page);
  }
}
