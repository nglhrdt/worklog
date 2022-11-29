import { addDays, endOfDay, isFriday, isMonday, nextFriday, previousMonday, startOfDay } from "date-fns";

export class Week {
    public readonly start: Date;
    public readonly end: Date;

    constructor(addWeeks: number = 0) {
        const now: Date = new Date();
        let start: Date = isMonday(now) ? now : previousMonday(now);
        let end: Date = isFriday(now) ? now : nextFriday(now);
        
        this.start = startOfDay(addDays(start, 7 * addWeeks));
        this.end = endOfDay(addDays(end, 7 * addWeeks));
    }

    toString(): string {
        return `${this.start.toLocaleDateString()} - ${this.end.toLocaleDateString()}`;
    }
}