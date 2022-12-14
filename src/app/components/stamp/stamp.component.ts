import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Functions, HttpsCallable, httpsCallable, httpsCallableData } from '@angular/fire/functions';
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
  lastWorkTimeEntry$: Observable<WorkTime | undefined>;
  stampFunction: HttpsCallable;

  constructor(public workTimeService: WorkTimeService, private functions: Functions) {
    this.lastWorkTimeEntry$ = workTimeService.getLastWorkTimeEntry$();
    this.stampFunction = httpsCallable(this.functions, 'stamp', { timeout: 3_000 });
  }

  stamp() {
    console.warn('stamp');
    this.stampFunction().then();
    console.warn('stamp');
  }
}
