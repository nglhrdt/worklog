import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { map, mergeMap, Observable } from 'rxjs';
import { BackButtonDirective } from 'src/app/directives/back-button.directive';
import { WorkTimeEditModel } from 'src/app/models/work-time';
import { NavigationService } from 'src/app/services/navigation.service';
import { WorkTimeService } from 'src/app/services/work-time.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-work-time-edit',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BackButtonDirective, FontAwesomeModule, FormsModule],
  templateUrl: './work-time-edit.component.html',
})
export class WorkTimeEditComponent {
  workTime$: Observable<WorkTimeEditModel>;

  faMinus = faMinus;
  faPlus = faPlus;
  faTrash = faTrash;

  constructor(route: ActivatedRoute, private workTimeService: WorkTimeService, private navigationService: NavigationService, private router: Router) {
    this.workTime$ = route.params.pipe(
      map((params: Params) => params['id']),
      mergeMap((workTimeId: string) => workTimeService.getById$(workTimeId)),
      map(workTime => new WorkTimeEditModel(workTime))
    );
  }

  saveChanges(model: WorkTimeEditModel): void {
    this.workTimeService.update(model.getWorkTime());
    this.navigationService.back();
  }

  delete(model: WorkTimeEditModel): void {
    this.workTimeService.delete(model.getWorkTime());
    this.router.navigateByUrl('/');
  }
}
