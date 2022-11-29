import { FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from "@angular/fire/firestore";
import { Activity, ActivityType, WorkingLocation } from "../models/activity";

export const activityConverter: FirestoreDataConverter<Activity> = {
    toFirestore(activity: Activity): DocumentData {
        return { ...activity };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot<{ date: Timestamp, id: string, ticket: string, durationMinutes: number, location: WorkingLocation, type: ActivityType, summary: string }>,
        options: SnapshotOptions
    ): Activity {
        const data = snapshot.data(options)!;
        return new Activity(data.date.toDate(), data.ticket, data.durationMinutes, data.location, data.type, data.id, data.summary);
    }
};