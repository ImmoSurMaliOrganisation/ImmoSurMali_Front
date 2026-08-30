import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth';
import { ThemeService } from '../../core/services/theme';
import {
  LucideLayoutDashboard,
  LucideBuilding2,
  LucideUsers,
  LucideHome,
  LucideShieldAlert,
  LucideSettings,
  LucideLogOut,
  LucideMoon,
  LucideSun,
  LucideMenu,
  LucideX,
  LucideBell,
} from '@lucide/angular';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../client/shared/components/button.component";
import { AgenceAdminService } from '../_services/agence-admin.service';

@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideLayoutDashboard,
    LucideBuilding2,
    LucideUsers,
    LucideHome,
    LucideShieldAlert,
    LucideSettings,
    LucideLogOut,
    LucideMoon,
    LucideSun,
    LucideMenu,
    LucideX,
    LucideBuilding2,
    LucideBell,
    ButtonComponent
],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  public authService = inject(AuthService);
  public themeService = inject(ThemeService);
  private router = inject(Router);
  public agenceService = inject(AgenceAdminService);

  // ÉTAT DE LA SIDEBAR MOBILE
  isSidebarOpen = signal(false);

  // ICÔNES
  LucideLayoutDashboard = LucideLayoutDashboard;
  lucideBuilding2 = LucideBuilding2;
  LucideUsers = LucideUsers;
  LucideHome = LucideHome;
  LucideShieldAlert = LucideShieldAlert;
  LucideSettings = LucideSettings;
  LucideLogOut = LucideLogOut;
  LucideMoon = LucideMoon;
  LucideSun = LucideSun;
  LucideMenu = LucideMenu;
  LucideX = LucideX;
  LucideBell = LucideBell;

  // LIENS DE NAVIGATION ADMIN
  navLinks = [
    {
      label: 'Tableau de bord',
      route: '/admin/dashboard',
      icon: LucideLayoutDashboard,
      badge: null,
    },
    {
      label: 'Validation Agences',
      route: '/admin/agences-validation',
      icon: LucideBuilding2,
      badge: '2',
    }, // Badge pour agences en attente
    { label: 'Utilisateurs', route: '/admin/users', icon: LucideUsers, badge: null },
    { label: 'Annonces & Biens', route: '/admin/annonces', icon: LucideHome, badge: null },
    { label: 'Signalements', route: '/admin/reports', icon: LucideShieldAlert, badge: null },
    { label: 'Paramètres', route: '/admin/settings', icon: LucideSettings, badge: null },
  ];

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
