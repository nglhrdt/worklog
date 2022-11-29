import { Pipe, PipeTransform } from '@angular/core';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faPlane, faSyringe, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { WorkTime } from '../models/work-time';

@Pipe({
  name: 'workTimeIcon',
  standalone: true
})
export class WorkTimeIconPipe implements PipeTransform {
  faClock = faClock;
  faPlane = faPlane;
  faSyringe = faSyringe;

  transform(workTime: WorkTime): IconDefinition {
    switch (workTime.type) {
      case 'vacation':
        return faPlane;
      case 'sick':
        return faSyringe;
      default:
        return faClock;
    }
  }
}
