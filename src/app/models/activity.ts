export class Activity {
    constructor(
        public date: Date,
        public ticket: string,
        public durationMinutes: number,
        public location: WorkingLocation,
        public type: ActivityType,
        public id?: string,
        public summary?: string,
    ) { }

    addDuration(minutes: number): void {
        this.durationMinutes += minutes;
    }

    toEvaluationTitle(): string {
        switch (this.type) {
            case 'development':
                return 'Entwicklung';
            case 'meeting':
                return 'Meetings';
            default:
                return this.ticket.trim();
        }
    }
}

export type WorkingLocation = 'mobile' | 'company';

export type ActivityType = 'development' | 'meeting';
