import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MinutesToHoursAndMinutesPipe } from 'src/app/pipes/minutes-to-hours-and-minutes.pipe';
import { WorkTimeService } from 'src/app/services/work-time.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { StampComponent } from '../stamp/stamp.component';

@Component({
  selector: 'app-today-summary',
  standalone: true,
  imports: [SharedModule, MinutesToHoursAndMinutesPipe, StampComponent],
  templateUrl: './today-summary.component.html',
  providers: [MinutesToHoursAndMinutesPipe]
})
export class TodaySummaryComponent {
  presenceMinutes$: Observable<number>;
  presenceMinutesWeek$: Observable<number>;
  openTime$: Observable<number>;
  eveningDate$: Observable<Date>;

  constructor(workTimeService: WorkTimeService) {
    this.presenceMinutes$ = workTimeService.getPresenceTime$();
    this.presenceMinutesWeek$ = workTimeService.getWeekPresenceTime$();
    this.openTime$ = workTimeService.getOpenTime$();
    this.eveningDate$ = workTimeService.getEveningDate$();
  }
}
