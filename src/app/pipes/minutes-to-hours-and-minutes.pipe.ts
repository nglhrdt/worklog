import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHoursAndMinutes',
  standalone: true,
})
export class MinutesToHoursAndMinutesPipe implements PipeTransform {

  transform(minutes: number | null): string {
    const hoursString: string = Math.floor((minutes ?? 0) / 60).toString().padStart(2, '0');
    const minutesString: string = Math.floor((minutes ?? 0) % 60).toString().padStart(2, '0');

    return `${hoursString}:${minutesString}`;
  }

}
