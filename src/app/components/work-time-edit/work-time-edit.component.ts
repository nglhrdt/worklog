import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faFloppyDisk, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { isAfter, isEqual } from 'date-fns';
import { map, mergeMap, Observable, tap } from 'rxjs';
import { WorkTime } from 'src/app/models/work-time';
import { NavigationService } from 'src/app/services/navigation.service';
import { WorkTimeService } from 'src/app/services/work-time.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditTimeComponent } from '../edit-time/edit-time.component';

@Component({
  selector: 'app-work-time-edit',
  standalone: true,
  imports: [SharedModule, EditTimeComponent],
  templateUrl: './work-time-edit.component.html',
})
export class WorkTimeEditComponent {
  workTime$: Observable<WorkTime>;

  faTrashCan = faTrashCan;
  faFloppyDisk = faFloppyDisk;
  isEntryValid?: boolean;

  constructor(route: ActivatedRoute, private workTimeService: WorkTimeService, private navigationService: NavigationService, private router: Router) {
    this.workTime$ = route.params.pipe(
      map((params: Params) => params['id']),
      mergeMap((workTimeId: string) => workTimeService.getById$(workTimeId)),
      tap((workTime: WorkTime) => this.setSaveButtonState(workTime)),
    );
  }

  saveChanges(workTime: WorkTime): void {
    this.workTimeService.update(workTime);
    this.navigationService.back();
  }

  delete(workTime: WorkTime): void {
    this.workTimeService.delete(workTime);
    this.router.navigateByUrl('/');
  }

  setSaveButtonState(workTime: WorkTime): void {
    this.isEntryValid = workTime.end
      ? isEqual(workTime.end, workTime.start) || isAfter(workTime.end, workTime.start)
      : true;
  }
}
