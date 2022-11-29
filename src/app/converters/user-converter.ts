import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { Integration, IntegrationType, User } from "../models/user";

export const userConverter: FirestoreDataConverter<User> = {
    toFirestore(user: User): DocumentData {
        console.warn({...user})
        return { ...user };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot<{ integrations: Partial<Record<IntegrationType, Integration>> }>,
        options: SnapshotOptions
    ): User {
        const data = snapshot.data(options)!;
        return new User(data.integrations);
    }
};
