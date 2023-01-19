import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { addHours, addMinutes, getHours, getMinutes, setHours, setMinutes, subHours, subMinutes } from 'date-fns';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputNumberComponent } from '../input-number/input-number.component';

@Component({
  selector: 'app-edit-time',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule, InputNumberComponent],
  templateUrl: './edit-time.component.html',
  styleUrls: ['./edit-time.component.scss']
})
export class EditTimeComponent {
  faMinus = faMinus;
  faPlus = faPlus;

  @HostBinding('class') cssClasses = 'grid grid-cols-3 grid-cols-edit-data-grid gap-2 items-stretch';

  private _date?: Date;
  hours?: number;
  minutes?: number;

  @Input() set date(date: Date) {
    this._date = date;
    this.hours = getHours(date);
    this.minutes = getMinutes(date);
  };
  @Output() dateChange = new EventEmitter<Date>();

  decrementMinutes(): void {
    if (this._date) {
      this.date = subMinutes(this._date, 1);
      this.dateChange.emit(this._date);
    }
  }

  decrementHours(): void {
    if (this._date) {
      this.date = subHours(this._date, 1);
      this.dateChange.emit(this._date);
    }
  }

  incrementMinutes(): void {
    if (this._date) {
      this.date = addMinutes(this._date, 1);
      this.dateChange.emit(this._date);
    }
  }

  incrementHours(): void {
    if (this._date) {
      this.date = addHours(this._date, 1);
      this.dateChange.emit(this._date);
    }
  }

  updateMinutes(minutes: number): void {
    if (this._date) {
      this.date = setMinutes(this._date, minutes);
      this.dateChange.emit(this._date);
    }
  }

  updateHours(hours: number): void {
    if (this._date) {
      this.date = setHours(this._date, hours);
      this.dateChange.emit(this._date);
    }
  }
}
