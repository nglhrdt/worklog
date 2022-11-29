import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from "@angular/fire/firestore";
import { WorkTime, WorkTimeType } from "../models/work-time";

export const workTimeConverter: FirestoreDataConverter<WorkTime> = {
    toFirestore(workTime: WorkTime): DocumentData {
        return { ...workTime };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot<{ start: Timestamp, type: WorkTimeType, id: string, end?: Timestamp }>,
        options: SnapshotOptions
    ): WorkTime {
        const data = snapshot.data(options)!;
        return new WorkTime(data.start.toDate(), data.type, data.end?.toDate(), data.id);
    }
};