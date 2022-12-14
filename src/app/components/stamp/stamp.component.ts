import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Functions, httpsCallable, httpsCallableData } from '@angular/fire/functions';
import { EMPTY, Observable } from 'rxjs';
import { WorkTime } from 'src/app/models/work-time';
import { WorkTimeService } from 'src/app/services/work-time.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-stamp',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: 'stamp.component.html',
})
export class StampComponent {
  yadaFunction: (data: any) => Observable<any>;
  response$: Observable<any> = EMPTY;

  lastWorkTimeEntry$: Observable<WorkTime | undefined>
  constructor(public workTimeService: WorkTimeService, private functions: Functions) {
    this.lastWorkTimeEntry$ = workTimeService.getLastWorkTimeEntry$();
    this.yadaFunction = httpsCallableData(functions, 'stamp', { timeout: 3_000 });
  }

  stamp() {
    console.warn('stamp');
    this.response$ = this.yadaFunction({});
    this.response$.subscribe();
    console.warn('stamp');
  }
}
