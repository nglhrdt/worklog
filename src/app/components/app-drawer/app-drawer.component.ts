import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-app-drawer',
  standalone: true,
  imports: [SharedModule, NavComponent, RouterOutlet],
  templateUrl: './app-drawer.component.html',
  styleUrls: ['./app-drawer.component.scss']
})
export class AppDrawerComponent {

}
