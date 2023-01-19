import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addDays, endOfMonth, getDate, isBefore, isEqual, isMonday, isSunday, isWithinInterval, nextMonday, startOfMonth, subDays } from 'date-fns';
import { SharedModule } from 'src/app/shared/shared.module';

interface SelectableDay { day: Date, selected: boolean }

@Component({
  selector: 'app-day-selection',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './day-selection.component.html',
  styleUrls: ['./day-selection.component.scss']
})
export class DaySelectionComponent implements OnInit {
  @Output() selectionChanged = new EventEmitter<Date[]>();
  @Input() date: Date = new Date();

  headerRow: Date[] = [];
  days: SelectableDay[] = [];
  start?: Date;
  end?: Date;

  constructor() {
  }

  ngOnInit(): void {
    const monday = nextMonday(new Date());
    for (let i = 0; i < 7; i++) {
      this.headerRow.push(addDays(monday, i))
    }

    const startOfMonthDate: Date = startOfMonth(this.date);
    const endOfMonthDate: Date = endOfMonth(this.date);

    for (let i = 0; i < getDate(endOfMonthDate); i++) {
      this.days.push({ day: addDays(startOfMonthDate, i), selected: false });
    }

    if (!isSunday(endOfMonthDate)) {
      let dateToAdd: Date = endOfMonthDate;
      while (!isSunday(dateToAdd)) {
        dateToAdd = addDays(dateToAdd, 1);
        this.days.push({ day: dateToAdd, selected: false });
      }
    }

    if (!isMonday(startOfMonthDate)) {
      let dateToAdd: Date = startOfMonthDate;
      while (!isMonday(dateToAdd)) {
        dateToAdd = subDays(dateToAdd, 1);
        this.days.splice(0, 0, { day: dateToAdd, selected: false });
      }
    }
  }

  onDayClick(clickedDay: SelectableDay): void {
    if (!this.start) {
      this.start = clickedDay.day;
    } else if (!this.end) {
      if (isEqual(this.start, clickedDay.day)) {
        this.start = undefined;
      } else if (isBefore(clickedDay.day, this.start!)) {
        this.end = this.start;
        this.start = clickedDay.day;
      } else {
        this.end = clickedDay.day;
      }
    } else {
      this.start = clickedDay.day;
      this.end = undefined;
    }

    this.setSelection();

    this.selectionChanged.emit(this.days.filter(selectableDay => selectableDay.selected).map(selectableDay => selectableDay.day));
  }

  private setSelection(): void {
    if (this.start && this.end) {
      this.days.forEach(selectableDay => selectableDay.selected = isWithinInterval(selectableDay.day, { start: this.start!, end: this.end! }))
    } else if (this.start) {
      this.days.forEach(selectableDay => selectableDay.selected = isWithinInterval(selectableDay.day, { start: this.start!, end: this.start! }))
    } else {
      this.days.forEach(selectableDay => selectableDay.selected = false);
    }
  }
}
