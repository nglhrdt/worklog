import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-app-drawer',
  standalone: true,
  imports: [CommonModule, NavComponent, RouterOutlet],
  templateUrl: './app-drawer.component.html',
  styleUrls: ['./app-drawer.component.scss']
})
export class AppDrawerComponent {

}
