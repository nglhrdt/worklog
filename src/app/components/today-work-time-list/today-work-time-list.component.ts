import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkTime } from 'src/app/models/work-time';
import { WorkTimeService } from 'src/app/services/work-time.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkTimeDetailsComponent } from '../work-time-details/work-time-details.component';

@Component({
  selector: 'app-today-work-time-list',
  standalone: true,
  imports: [SharedModule, WorkTimeDetailsComponent],
  template: `
    <div class="card-title">Today work time</div>
    <div class="grid grid-flow-row gap-4 pt-4">
      <app-work-time-details [workTime]="workTime" *ngFor="let workTime of workTimeList$ | async"></app-work-time-details>
    </div>
  `,
})
export class TodayWorkTimeListComponent {
  workTimeList$: Observable<WorkTime[]>;
  constructor(public workTimeService: WorkTimeService) {
    this.workTimeList$ = workTimeService.getTodayWorkTimeEntries$();
  }
}
