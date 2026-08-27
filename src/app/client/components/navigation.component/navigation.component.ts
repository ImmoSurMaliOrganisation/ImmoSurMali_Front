import { Component, signal, HostListener, inject } from '@angular/core';
import {
  LucideHouse,
  LucideSearch,
  LucideHeart,
  LucideUser,
  LucideMoon,
  LucideMap,
  LucideSun,
  LucideBell,
} from '@lucide/angular';
import { NavigationService } from '../../shared/services/navigation.service';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    LucideHouse,
    LucideSun,
    LucideSearch,
    LucideHeart,
    LucideBell,
    LucideUser,
    LucideMap,
    LucideMoon,
    RouterLink,
  ],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  activeTab = signal('home');
  public themeService = inject(ThemeService);

  public navService: NavigationService = inject(NavigationService);


}
