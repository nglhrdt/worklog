import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { WorkTimeService } from 'src/app/services/work-time.service';
import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-create-activity',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, ActivityFormComponent],
  templateUrl: './create-activity.component.html',
})
export class CreateActivityComponent implements OnDestroy {
  activity: Activity;

  private onDestroy$ = new Subject<void>();

  constructor(private activityService: ActivityService, private workTimeService: WorkTimeService) {
    this.activity = Activity.emptyActivity('mobile');
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
        .then(() => this.activity = Activity.emptyActivity(activity.location));
    }
  }
}
