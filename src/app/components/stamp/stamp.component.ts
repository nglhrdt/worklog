import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
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
  lastWorkTimeEntry$: Observable<WorkTime | undefined>;
  isButtonDisabled: boolean = false;

  constructor(public workTimeService: WorkTimeService, private functions: Functions) {
    this.lastWorkTimeEntry$ = workTimeService.getLastWorkTimeEntry$();
  }

  stamp() {
    this.isButtonDisabled = true;
    httpsCallable(this.functions, 'stamp')().finally(() => this.isButtonDisabled = false);
  }
}
