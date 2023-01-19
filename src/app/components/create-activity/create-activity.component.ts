import { Component, OnDestroy } from '@angular/core';
import { startOfToday } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { LocationService } from 'src/app/services/location.service';
import { WorkTimeService } from 'src/app/services/work-time.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivityFormComponent } from '../activity-form/activity-form.component';

@Component({
  selector: 'app-create-activity',
  standalone: true,
  imports: [SharedModule, ActivityFormComponent],
  templateUrl: './create-activity.component.html',
})
export class CreateActivityComponent implements OnDestroy {
  activity: Activity;

  private onDestroy$ = new Subject<void>();

  constructor(
    private activityService: ActivityService,
    private workTimeService: WorkTimeService,
    private locationService: LocationService,
  ) {
    this.activity = this.emptyActivity();
    this.workTimeService
      .getNormalizedOpenWorkTime$()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(openDuration => this.activity.durationMinutes = openDuration);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  create(activity: Activity): void {
    if (this.activity.durationMinutes > 0 && this.activity.ticket) {
      this.activityService
        .create(activity)
        .then(() => this.activity = this.emptyActivity());
    }
  }

  private emptyActivity(): Activity {
      return new Activity(
          startOfToday(),
          '',
          0,
          this.locationService.getLocation(),
          'development',
      );
  }
}
