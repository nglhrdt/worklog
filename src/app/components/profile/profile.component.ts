import { Component } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import { SharedModule } from 'src/app/shared/shared.module';
import { LogoutComponent } from '../logout/logout.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule, LogoutComponent, RouterLink, FontAwesomeModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: User;
  integrationIcon = faAtlassian;

  constructor(auth: Auth) {
    this.user = auth.currentUser!;
  }
}
