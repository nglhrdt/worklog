import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, map, mergeMap, Subject, takeUntil } from 'rxjs';
import { BackButtonDirective } from 'src/app/directives/back-button.directive';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { WorkTimeService } from 'src/app/services/work-time.service';
import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-activity-edit',
  standalone: true,
  imports: [CommonModule, BackButtonDirective, ButtonComponent, ActivityFormComponent],
  templateUrl: './activity-edit.component.html',
})
export class ActivityEditComponent implements OnDestroy {
  activity?: Activity;

  private onDestroy = new Subject<void>();

  constructor(route: ActivatedRoute, private activityService: ActivityService, private navigationService: NavigationService, private workTimeService: WorkTimeService) {
    route.params
      .pipe(
        map(params => params['id']),
        mergeMap(id => activityService.getActivityById$(id)),
        takeUntil(this.onDestroy),
      )
      .subscribe(
        activity => this.activity = activity
      );
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  delete(activity: Activity): void {
    this.activityService.delete(activity)
      .then(() => this.navigationService.back())
      .catch((e) => console.error(e));
  }

  update(activity: Activity): void {
    this.activityService.update(activity).then(() => this.navigationService.back());
  }

  applyOpenTime(activity: Activity): void {
    this.workTimeService
      .getNormalizedOpenWorkTime$()
      .pipe(first())
      .subscribe(openTime => {
        activity.addDuration(openTime);
        this.update(activity);
      });
  }
}
