import { Component } from '@angular/core';
import { addDays, isBefore, isEqual } from 'date-fns';
import { cloneDeep } from 'lodash-es';
import { map, Observable } from 'rxjs';
import { Activity, WorkingLocation } from 'src/app/models/activity';
import { Week } from 'src/app/models/week';
import { ActivityService } from 'src/app/services/activity.service';
import { DAILY_WORK_TIME } from 'src/app/services/work-time.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { normalizeToFifteenMinutes } from 'src/app/util/utils';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';

interface SelectBoxOption {
  week: Week;
  label: string;
}

interface ActivitiesByDay {
  date: Date,
  activities: Activity[]
}

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [SharedModule, ActivityDetailsComponent],
  templateUrl: 'evaluation.component.html',
})
export class EvaluationComponent {
  selectedOption: SelectBoxOption;
  selectBoxOptions: SelectBoxOption[];
  activitiesByDayList$: Observable<ActivitiesByDay[]>;

  constructor(private activityService: ActivityService) {
    this.selectBoxOptions = [new Week(), new Week(-1), new Week(-2), new Week(-3), new Week(-4), new Week(-5)].map(this.weekToSelectBoxOption);
    this.selectedOption = this.selectBoxOptions[0];
    this.activitiesByDayList$ = this.getActivitiesByDay$();
  }

  private getActivitiesByDay$(): Observable<ActivitiesByDay[]> {
    return this.getActivitiesForSelectedWeek$()
      .pipe(
        map(activities => this.createActivitiesByDayMap(activities))
      )
  }

  private createActivitiesByDayMap(activities: Activity[]): ActivitiesByDay[] {
    const result: ActivitiesByDay[] = [];

    let date: Date = this.selectedOption.week.start;
    do {
      result.push({ date, activities: activities.filter(activity => isEqual(activity.date, date)) })
      date = addDays(date, 1);
    }
    while (isBefore(date, this.selectedOption.week.end))

    return result;
  }

  private getActivitiesForSelectedWeek$(): Observable<Activity[]> {
    return this.activityService.getActivitiesByWeek$(this.selectedOption.week);
  }

  copyToClipboard(activitiesByDay: ActivitiesByDay[]): void {
    navigator.clipboard.writeText(this.createEvaluationMap(cloneDeep(activitiesByDay)));
  }

  private weekToSelectBoxOption(week: Week): SelectBoxOption {
    return {
      label: week.toString(),
      week
    }
  }

  onSelectionChange(): void {
    this.activitiesByDayList$ = this.getActivitiesByDay$();
  }

  private createEvaluationMap(activitiesByDay: ActivitiesByDay[]): string {
    return activitiesByDay
      .reduce((result: string[], activities) => result.concat(this.activitiesToEvaluationDayResult(activities)), [])
      .join('\n');
  }

  private activitiesToEvaluationDayResult(activitiesByDay: ActivitiesByDay): string[] {
    const activities = this.joinTimesByType(activitiesByDay.activities)

    const result = activities
      .reduce((result: { sum: number, lines: string[] }, activity: Activity) => {
        const duration = normalizeToFifteenMinutes(activity.durationMinutes)

        if (result.sum + duration <= DAILY_WORK_TIME) {
          result.lines.push(`${activity.toEvaluationTitle()};IB68I;88;3;;${(duration / 60).toLocaleString('de-DE')};;`);
        } else if (result.sum >= DAILY_WORK_TIME) {
          result.lines.push(`${activity.toEvaluationTitle()};IB68I;88;3;;;${(duration / 60).toLocaleString('de-DE')};`);
        } else {
          const normal = DAILY_WORK_TIME - result.sum;
          const over = duration - normal;

          result.lines.push(`${activity.toEvaluationTitle()};IB68I;88;3;;${(normal / 60).toLocaleString('de-DE')};${(over / 60).toLocaleString('de-DE')};`);
        }

        result.sum += duration;

        return result;
      }, { sum: 0, lines: [] })

    if (result.lines.length) {
      const locations: string[] = activities
        .reduce<WorkingLocation[]>((locations, activitiy) => {
          if (activitiy.location && !locations.includes(activitiy.location)) {
            locations.push(activitiy.location);
          }
          return locations;
        }, [])
        .map((location) => location === 'company' ? 'Büro' : 'Mobil');

      result.lines.splice(0, 0, locations.join(' / '));
    }

    while (result.lines.length < 5) {
      result.lines.push(this.getEmptyLine());
    }

    return result.lines;
  }

  private joinTimesByType(activities: Activity[]): Activity[] {
    const result: Activity[] = [];

    activities.forEach(activity => {
      const activityWithSameType: Activity | undefined = result.find(resultActivity => resultActivity.type === activity.type);

      if (activityWithSameType) {
        activityWithSameType.durationMinutes += activity.durationMinutes;
      } else {
        result.push(activity);
      }
    });

    return result;
  }

  private getEmptyLine(): string {
    return ';;;;;;;';
  }
}
