import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Activity, WorkingLocation } from 'src/app/models/activity';
import { LocationService } from 'src/app/services/location.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent {
  @Input() activity!: Activity;
  @Output() activityChange = new EventEmitter<Activity>();

  constructor(private locationService: LocationService) {}

  changeLocation(location: WorkingLocation) {
    this.locationService.storeLocation(location);
    this.activity.location = location;
    this.activityChange.emit(this.activity);
  }

  onSubmit(): void {
    if (this.activity.durationMinutes && this.activity.ticket) {
      this.activityChange.emit(this.activity);
    }
  }
}
