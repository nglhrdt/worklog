import { addHours, addMinutes, differenceInMinutes, getHours, getMinutes, isSameDay, setMilliseconds, setSeconds, subHours, subMinutes } from "date-fns";
import { getDateWithoutSeconds } from "../util/utils";

export class WorkTime {
  constructor(
    public start: Date,
    public type: WorkTimeType,
    public end?: Date,
    public id?: string,
  ) { }

  getDurationInMinutes(): number {
    return differenceInMinutes(this.end ?? getDateWithoutSeconds(), this.start);
  }
}

export type WorkTimeType = 'work' | 'vacation' | 'sick';

export class WorkTimeEditModel {
  private workTime: WorkTime;

  public startHours: number;
  public startMinutes: number;
  public endHours?: number;
  public endMinutes?: number;

  public hasEnd: boolean;

  constructor(workTime: WorkTime) {
    this.workTime = workTime;

    this.startHours = getHours(workTime.start);
    this.startMinutes = getMinutes(workTime.start);

    if (workTime.end) {
      this.endHours = getHours(workTime.end);
      this.endMinutes = getMinutes(workTime.end);
    }

    this.hasEnd = !!workTime.end;
  }

  getWorkTime(): WorkTime {
    return this.workTime;
  }

  incrementMinuteStart(): void {
    const newDate = addMinutes(this.workTime.start, 1);
    if (this.isSameDayAsInitalDay(newDate)) {
      this.setStartFields(newDate);
    }
  }

  decrementMinuteStart(): void {
    const newDate = subMinutes(this.workTime.start, 1);
    if (this.isSameDayAsInitalDay(newDate)) {
      this.setStartFields(newDate);
    }
  }

  incrementMinuteEnd(): void {
    if (this.workTime.end) {
      const newDate = addMinutes(this.workTime.end, 1);
      if (this.isSameDayAsInitalDay(newDate)) {
        this.setEndFields(newDate);
      }
    }
  }

  decrementMinuteEnd(): void {
    if (this.workTime.end) {
      const newDate = subMinutes(this.workTime.end, 1);
      if (this.isSameDayAsInitalDay(newDate)) {
        this.setEndFields(newDate);
      }
    }
  }

  incrementHourStart(): void {
    const newDate = addHours(this.workTime.start, 1);
    if (this.isSameDayAsInitalDay(newDate)) {
      this.setStartFields(newDate);
    }
  }

  decrementHourStart(): void {
    const newDate = subHours(this.workTime.start, 1);
    if (this.isSameDayAsInitalDay(newDate)) {
      this.setStartFields(newDate);
    }
  }

  incrementHourEnd(): void {
    if (this.workTime.end) {
      const newDate = addHours(this.workTime.end, 1);
      if (this.isSameDayAsInitalDay(newDate)) {
        this.setEndFields(newDate);
      }
    }
  }

  decrementHourEnd() {
    if (this.workTime.end) {
      const newDate = subHours(this.workTime.end, 1);
      if (this.isSameDayAsInitalDay(newDate)) {
        this.setEndFields(newDate);
      }
    }
  }

  private setStartFields(newStart: Date): void {
    this.workTime.start = newStart;
    this.startHours = getHours(newStart);
    this.startMinutes = getMinutes(newStart);
  }

  private setEndFields(newEnd: Date): void {
    this.workTime.end = newEnd;
    this.endHours = getHours(newEnd);
    this.endMinutes = getMinutes(newEnd);
  }

  isSameDayAsInitalDay(date: Date): boolean {
    return isSameDay(date, this.workTime.start);
  }
}
