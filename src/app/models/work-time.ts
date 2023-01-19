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
