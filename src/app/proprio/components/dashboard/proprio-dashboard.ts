import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './proprio-dashboard.html',
  styleUrl: './proprio-dashboard.css',
})
export class ProprioDashboard {

  private authService = inject(AuthService);
  private router = inject(Router);
  onLogout(): void {
    this.authService.logout();
  }
}
