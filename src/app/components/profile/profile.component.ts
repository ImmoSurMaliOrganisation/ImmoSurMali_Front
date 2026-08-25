import { Component, effect, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import {
  LucideBellRing,
  LucideCamera,
  LucideChevronLeft,
  LucideChevronRight,
  LucideKeyRound,
  LucideLogOut,
  LucideMapPin,
  LucideUser,
} from '@lucide/angular';
import { FormInputComponent } from '../../shared/components/form-input.component';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideCamera,
    LucideMapPin,
    LucideKeyRound,
    LucideChevronRight,
    LucideBellRing,
    LucideChevronRight,
    LucideChevronLeft,
    LucideLogOut,
    LucideUser,
    FormInputComponent,
    ButtonComponent,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnDestroy {
  isEditing = signal(false);
  avatarUrl = signal(
    'https://ui-avatars.com/api/?name=Moussa+Diarra&background=333&color=fff&size=128',
  );
  activeSection = signal<'profile' | 'password' | 'notifications'>('profile');

  profileForm!: FormGroup;

  passwordForm = new FormGroup({
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
  });

  notificationsForm = new FormGroup({
    emailAlerts: new FormControl(true),
    pushAlerts: new FormControl(false),
  });

  constructor(private fb: FormBuilder) {
    // S'assurer que le body ne reste pas bloqué
    document.body.style.overflow = 'auto';

    this.profileForm = this.fb.group({
      fullName: ['Moussa Diarra', Validators.required],
      email: [{ value: 'moussa@example.com', disabled: true }],
      phone: ['+223 70 00 00 00'],
      bio: ['Passionné par l’immobilier moderne en Afrique.'],
      language: ['Français'],
      currency: ['FCFA'],
    });
  }

  setSection(section: 'profile' | 'password' | 'notifications') {
    this.activeSection.set(section);
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      console.log('Mot de passe mis à jour :', this.passwordForm.value);
      this.isEditing.set(false);
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      console.log('Profil mis à jour :', this.profileForm.getRawValue());
      this.isEditing.set(false);
    }
  }

  saveNotifications(): void {
    if (this.notificationsForm.valid) {
      console.log('Notifications sauvegardées :', this.notificationsForm.value);
      this.isEditing.set(false);
    }
  }

  ngOnDestroy() {
    // Restaure le scroll si le composant est détruit
    document.body.style.overflow = 'auto';
  }

  logout() {
    console.log('Déconnexion de tous les appareils');
  }
}
