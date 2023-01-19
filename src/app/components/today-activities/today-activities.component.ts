import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';

@Component({
  selector: 'app-today-activities',
  standalone: true,
  imports: [SharedModule, ActivityDetailsComponent],
  templateUrl: 'today-activities.component.html',
})
export class TodayActivitiesComponent {
  activities$: Observable<Activity[]>;

  constructor(activityService: ActivityService) {
    this.activities$ = activityService.getTodayActivities$();
  }
}
