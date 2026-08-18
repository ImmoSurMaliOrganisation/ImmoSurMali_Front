import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
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
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  isEditing = signal(false);
  activeSection = signal<string>('profile');
  avatarUrl = signal(
    'https://ui-avatars.com/api/?name=Moussa+Diarra&background=333&color=fff&size=128',
  );
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['Moussa Diarra', Validators.required],
      email: [{ value: 'moussa@example.com', disabled: true }], // Email souvent non modifiable directement
      phone: ['+223 70 00 00 00'],
      bio: ['Passionné par l’immobilier moderne en Afrique.'],
      language: ['Français'],
      currency: ['FCFA'],
    });
    effect(() => {
      if (this.activeSection() !== 'profile') {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    });
  }

  saveProfile() {
    this.isEditing.set(false);
    // Logique d'update API ici
  }
}
