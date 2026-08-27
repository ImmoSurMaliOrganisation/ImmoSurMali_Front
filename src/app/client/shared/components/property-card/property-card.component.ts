import { DecimalPipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import {
  LucideMapPin,
  LucideHeart,
  LucideBath,
  LucideMaximize,
  LucideBedDouble,
} from '@lucide/angular';
import { Property } from '../../models/property.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-property-card',
  imports: [
    LucideMapPin,
    LucideHeart,
    LucideBath,
    DecimalPipe,
    LucideBedDouble,
    LucideMaximize,
    RouterLink,
  ],
  templateUrl: './property-card.component.html',
  styles: ``,
})
export class PropertyCard {
  property = input.required<Property>();
  isFavorite = signal(false);
  toggleFavorite = output<Property>();

  onImageError(event: any) {
    event.target.src = 'https://placehold.co/800x600/f3f4f6/9ca3af?text=Immo+StarterPro';
  }
  onHeartClick(event: Event) {
    event.stopPropagation();
    this.isFavorite.update((value) => !value);
    this.toggleFavorite.emit(this.property());
  }
}
