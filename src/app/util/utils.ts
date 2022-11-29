import { setMilliseconds, setSeconds } from "date-fns";

export function getDateWithoutSeconds(): Date {
    return setMilliseconds(setSeconds(new Date(), 0), 0);
}

export function normalizeToFifteenMinutes(minutes: number): number {
    const durationMod15 = minutes % 15;
    return durationMod15 < 8 ? minutes - durationMod15 : minutes + 15 - durationMod15
}

export function workTimesCollectionName(userId: string): string {
    return `users/${userId}/work-times`;
}

export function activitiesCollectionName(userId: string): string {
    return `users/${userId}/activities`;
}
