import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from 'src/app/models/activity';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule],
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent {
  @Input() activity!: Activity;
  @Output() activityChange = new EventEmitter<Activity>();

  onSubmit(): void {
    if (this.activity.durationMinutes && this.activity.ticket) {
      this.activityChange.emit(this.activity);
    }
  }
}
