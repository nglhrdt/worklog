import { Component } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [SharedModule],
  template: `<app-button (click)="logout()">
    <div>Logout</div>
  </app-button>`,
})
export class LogoutComponent {
  constructor(private auth: Auth, private router: Router) { }

  logout() {
    signOut(this.auth).then(() => this.router.navigate(['login']));
  }
}
