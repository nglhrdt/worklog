import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';

@Component({
  selector: 'app-today-activities',
  standalone: true,
  imports: [CommonModule, ActivityDetailsComponent],
  templateUrl: 'today-activities.component.html',
})
export class TodayActivitiesComponent {
  activities$: Observable<Activity[]>;

  constructor(activityService: ActivityService) {
    this.activities$ = activityService.getTodayActivities$();
  }
}
