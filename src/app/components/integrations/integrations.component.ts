import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { userConverter } from 'src/app/converters/user-converter';
import { Integration, JiraIntegration, User } from 'src/app/models/user';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent {
  integration$: Observable<JiraIntegration>;

  constructor(private firestore: Firestore, private auth: Auth, private router: Router) {
    this.integration$ = docData(this.getUserDoc()).pipe(map((user: User) => (user.integrations.jira as JiraIntegration) ?? new JiraIntegration()))
  }

  saveIntegration(integration: Integration): void {
    updateDoc(this.getUserDoc(), { integrations: { jira: { ...integration } } }).then(() => this.router.navigate(['']));
  }

  private getUserDoc(): DocumentReference<User> {
    return doc(this.firestore, `users/${this.auth.currentUser?.uid}`).withConverter(userConverter);
  }
}
