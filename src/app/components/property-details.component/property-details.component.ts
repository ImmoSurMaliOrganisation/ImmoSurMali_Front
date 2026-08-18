import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PropertyDetails } from '../../shared/models/property.model';
import { ActivatedRoute } from '@angular/router';
import { PropertyCard } from '../../shared/components/property-card/property-card.component';
import { DecimalPipe } from '@angular/common';
import { MapView } from '../map-view.component/map-view.component';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { DetailNavbarComponent } from '../detail-navbar/detail-navbar.component';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideChevronLeft,
  LucideChevronRight,
  LucideMapPin,
  LucideMaximize2,
  LucideMessageCircle,
  LucideMinimize2,
  LucideX,
} from '@lucide/angular';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  imports: [
    PropertyCard,
    DecimalPipe,
    MapView,
    DetailNavbarComponent,
    LucideMessageCircle,
    LucideMapPin,
    LucideX,
    LucideChevronLeft,
    LucideChevronRight,
    LucideArrowLeft,
    LucideMaximize2,
    LucideMinimize2,
    LucideArrowRight,
  ],
})
export class PropertyDetailsComponent implements OnInit {
  private http = inject(HttpClient);
  showLightbox = signal(false);
  currentImageIndex = signal(0);
  isMapMaximized = signal(false);

  private route = inject(ActivatedRoute);

  property = signal<PropertyDetails | null>(null);

  stats = computed(() => {
    const p = this.property();
    if (!p) return [];

    return [
      { label: 'Area', value: `${p.sqft} m²` },
      { label: 'Bedrooms', value: p.beds.toString() },
      { label: 'Bathrooms', value: p.baths.toString() },
      { label: 'Type', value: p.category },
    ];
  });
  similarProperties = signal<PropertyDetails[]>([]);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    forkJoin({
      recent: this.http.get<PropertyDetails[]>('assets/data/recent_properties-details.json'),
      // popular: this.http.get<PropertyDetails[]>('assets/data/popular_properties-details.json'),
      similarProperties: this.http.get<PropertyDetails[]>('assets/data/properties.json'),
    }).subscribe({
      next: (results) => {
        // Mise à jour de tes signaux respectifs
        const propertyIndex = id ? Number(id) : null;
        const found = results.recent.find((p) => p.id === propertyIndex);
        this.property.set(found || null);
        //   this.mostLikedProperties.set(results.popular);

        this.similarProperties.set(
          results.similarProperties.filter((p) => p.id !== propertyIndex).slice(0, 3),
        );
        console.log(results);
        console.log('ICI');

        //   this.properties.set(results.all);

        //   this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données', err);
        //   this.isLoading.set(false);
      },
    });
  }

  //   Gallery Images
  openGallery(index: number) {
    this.currentImageIndex.set(index);
    this.showLightbox.set(true);
    document.body.style.overflow = 'hidden';
  }
  closeGallery() {
    this.showLightbox.set(false);
    document.body.style.overflow = 'auto';
  }

  nextImage(images: string[]) {
    this.currentImageIndex.update((i) => (i + 1) % images.length);
  }
  prevImage(images: string[]) {
    this.currentImageIndex.update((i) => (i - 1 + images.length) % images.length);
  }

  toggleMap() {
    this.isMapMaximized.update((v) => !v);
    if (this.isMapMaximized()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
}
