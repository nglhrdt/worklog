import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  faTableColumns = faTableColumns;

  constructor() { }

  ngOnInit(): void {
  }

}
