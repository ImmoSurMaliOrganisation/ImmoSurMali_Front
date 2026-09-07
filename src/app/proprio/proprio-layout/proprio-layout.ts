import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideBell,
  LucidePlusCircle,
  LucideLayoutDashboard,
  LucideBuilding2,
  LucideBadgeCheck,
  LucideSettings,
  LucideLogOut,
  LucideMoon,
  LucideSun,
  LucideBuilding,
  LucideInbox,
  LucideUserCheck,
} from '@lucide/angular';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../core/services/auth/auth';

@Component({
  selector: 'app-proprio-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideLayoutDashboard,
    LucideLogOut,
    LucideMoon,
    LucideSun,
    LucideBell,
    LucidePlusCircle,
    LucideLayoutDashboard,
    LucideBuilding,
    LucideInbox,
    LucideUserCheck
    
    
  ],
  templateUrl: './proprio-layout.html',
  styleUrl: './proprio-layout.css',
})
export class ProprioLayout {
  public authService = inject(AuthService);
  public themeService = inject(ThemeService);
  private router = inject(Router);

  isSidebarOpen = signal(false);

  // MENUS DÉDIÉS AGENCE IMMOBILIÈRE
  navLinks = [
    {
      label: 'Tableau de bord',
      route: '/proprio/dashboard',
      icon: LucideLayoutDashboard,
      badge: null,
    },
    { label: 'Mes Biens', route: '/proprio/biens', icon: LucideBuilding2, badge: null },
    {
      label: 'Profil Agence & Agrément',
      route: '/agence/profil',
      icon: LucideBadgeCheck,
      badge: null,
    },
    { label: 'Paramètres', route: '/agence/settings', icon: LucideSettings, badge: null },
  ];
  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
