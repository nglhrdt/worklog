import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [SharedModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  faTableColumns = faTableColumns;
}
