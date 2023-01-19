import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WorkTime } from 'src/app/models/work-time';
import { WorkTimeIconPipe } from 'src/app/pipes/work-time-icon.pipe';
import { WorkTimeService } from 'src/app/services/work-time.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-work-time-details',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule, RouterLink, WorkTimeIconPipe],
  providers: [WorkTimeIconPipe],
  template: `
    <div class="card hover:shadow-xl cursor-pointer flex flex-between gap-4" routerLink="/work-times/{{workTime.id}}">
      <fa-icon [icon]="workTime | workTimeIcon"></fa-icon>
      <div class="flex flex-row gap-1 grow">
        <div>{{workTime.start | date : 'shortTime'}}</div>
        <div>-</div>
        <div *ngIf="workTime.end">{{workTime.end | date : 'shortTime'}}</div>
      </div>
    </div>
  `,
})
export class WorkTimeDetailsComponent {
  @Input() workTime!: WorkTime;

  constructor(public workTimeService: WorkTimeService) { }
}
