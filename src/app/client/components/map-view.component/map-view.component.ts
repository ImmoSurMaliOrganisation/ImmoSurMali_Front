import {
  Component,
  Input,
  effect,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  input,
} from '@angular/core';
import * as L from 'leaflet';
import { Property } from '../../shared/models/property.model';

@Component({
  selector: 'app-map-view',
  standalone: true,
  template: `<div #mapContainer class="w-full h-full min-h-[500px] z-0 shadow-inner"></div>`,
  styleUrls: ['./map-view.component.css'],
})
export class MapView implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  properties = input.required<Property[]>();
  private map!: L.Map;
  private markerGroup = L.featureGroup();

  constructor() {
    effect(() => {
      const props = this.properties();

      if (this.map) {
        console.log('UpdateMarkers déclenché avec:', props.length, 'biens');
        this.updateMarkers();
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
    setTimeout(() => this.updateMarkers(), 300);
  }

  private initMap(): void {
    const houseSvg = `
    <div style="color: #ff4d4d; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25)); transform: translateY(-3px);">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="lucide lucide-house-icon lucide-house">
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path
        d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
    </div>
  `;

    const customDivIcon = L.divIcon({
      html: houseSvg,
      className: 'custom-house-icon', // Classe importante pour le CSS
      iconSize: [34, 34], // Légèrement plus grand pour la lisibilité
      iconAnchor: [17, 34], // Point d'ancrage bas-milieu
      popupAnchor: [0, -36], // Popup juste au-dessus
    });

    L.Marker.prototype.options.icon = customDivIcon;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [12.6392, -8.0029],
      zoom: 12,
      zoomControl: false,
    });

    this.map.locate({ setView: true, maxZoom: 16 });
    // Si la localisation réussit
    this.map.on('locationfound', (e) => {
      console.log('Position trouvée :', e.latlng);
      // Optionnel : ajouter un marqueur spécial pour l'utilisateur
      L.circle(e.latlng, { radius: e.accuracy / 2, color: '#2563eb' }).addTo(this.map);
    });

    // Si la localisation échoue (refus ou GPS éteint)
    this.map.on('locationerror', (e) => {
      console.warn('Localisation refusée ou impossible, on reste sur Bamako.');
      this.map.setView([12.6392, -8.0029], 12);
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    this.markerGroup.addTo(this.map);

    // Fix pour la taille
    setTimeout(() => this.map.invalidateSize(), 200);
  }

  private updateMarkers(): void {
    if (!this.map) return;

    this.markerGroup.clearLayers();

    this.properties().forEach((p) => {
      // DEBUG: Vérifie si p.coordinates existe bien
      if (p.coordinates && p.coordinates.lat && p.coordinates.lng) {
        const popupContent = `
          <div style="width: 160px;">
            <img src="${p.image}" style="width: 100%; border-radius: 4px;">
            <p style="margin: 5px 0 0; font-weight: bold;">${p.title}</p>
            <p style="margin: 0; color: #2563eb;">${p.price.toLocaleString()} €</p>
          </div>
        `;

        const marker = L.marker([p.coordinates.lat, p.coordinates.lng]).bindPopup(popupContent, {
          closeButton: false,
        });

        this.markerGroup.addLayer(marker);
      } else {
        console.warn('Propriété sans coordonnées:', p.title);
      }
    });

    // On ajuste la vue si on a des marqueurs
    const layers = this.markerGroup.getLayers();
    if (layers.length > 0) {
      const bounds = this.markerGroup.getBounds();
      this.map.fitBounds(bounds.pad(0.2));
    } else {
      // Si aucun marqueur, on force le focus sur Bamako
      this.map.setView([12.6392, -8.0029], 12);
    }
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }
}
