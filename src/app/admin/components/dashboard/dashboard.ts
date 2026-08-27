import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private authService = inject(AuthService);
  private router = inject(Router);
  onLogout(): void {
    this.authService.logout();
  }
}
