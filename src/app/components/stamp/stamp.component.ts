import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
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
  lastWorkTimeEntry$: Observable<WorkTime | undefined>
  constructor(public workTimeService: WorkTimeService) { 
    this.lastWorkTimeEntry$ = workTimeService.getLastWorkTimeEntry$();
  }
}
