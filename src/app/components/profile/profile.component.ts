import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { LogoutComponent } from '../logout/logout.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LogoutComponent, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: User;

  constructor(auth: Auth) { 
    this.user = auth.currentUser!;
  }
}
