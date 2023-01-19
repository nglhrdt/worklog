import { Component } from '@angular/core';
import { addHours, endOfDay, startOfDay } from 'date-fns';
import { Observable } from 'rxjs';
import { WorkTime, WorkTimeType } from 'src/app/models/work-time';
import { WorkTimeService } from 'src/app/services/work-time.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DaySelectionComponent } from '../day-selection/day-selection.component';
import { WorkTimeDetailsComponent } from '../work-time-details/work-time-details.component';

@Component({
  selector: 'app-work-time-create',
  standalone: true,
  imports: [SharedModule, DaySelectionComponent, WorkTimeDetailsComponent],
  templateUrl: './work-time-create.component.html',
  styleUrls: ['./work-time-create.component.scss']
})
export class WorkTimeCreateComponent {
  start?: Date;
  end?: Date;
  selection?: Date[];
  workTimeList$?: Observable<WorkTime[]>;

  constructor(private workTimeService: WorkTimeService) { }

  onSelectionChanged(selection: Date[]): void {
    this.selection = selection;

    if (selection.length === 0) {
      this.start = undefined;
      this.end = undefined;
      return;
    }

    if (selection.length === 1) {
      this.start = selection[0];
      this.end = undefined;
      this.setWorkTimeList();
      return;
    }

    this.start = selection[0];
    this.end = selection[selection.length - 1];
    this.setWorkTimeList();
  }

  private setWorkTimeList(): void {
    if (this.start) {
      this.workTimeList$ = this.workTimeService.getWorkTime$(startOfDay(this.start), endOfDay(this.end ?? this.start));
    } else {
      this.workTimeList$ = undefined;
    }
  }

  create(type: WorkTimeType): void {
    const workTimes = this.selection?.map(date => new WorkTime(startOfDay(date), type, addHours(startOfDay(date), 8)))!;
    this.workTimeService.createBatch(workTimes).then(() => {
      this.selection = undefined;
      this.start = undefined;
      this.end = undefined;
    });
  }
}
