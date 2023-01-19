import { Component } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { WorkTime } from 'src/app/models/work-time';
import { WorkTimeService } from 'src/app/services/work-time.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-stamp',
  standalone: true,
  imports: [SharedModule],
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
