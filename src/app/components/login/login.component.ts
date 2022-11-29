import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  msg?: string;

  constructor(private auth: Auth, private router: Router) { }

  signInWithGoogle(): void {
    this.msg = undefined;

    signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(() => this.router.navigate(['home']))
      .catch((err) => this.msg = err);
  }

  signInWithEmailAndPassword(email: string, password: string): void {
    this.msg = undefined;

    signInWithEmailAndPassword(this.auth, email, password)
      .then(() => this.router.navigate(['home']))
      .catch((err) => this.msg = err);
  }
}
