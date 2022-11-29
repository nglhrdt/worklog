import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, limit, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { startOfDay, startOfToday } from 'date-fns';
import { map, mergeMap, Observable, of, ReplaySubject } from 'rxjs';
import { activityConverter } from '../converters/activity-converter';
import { workTimeConverter } from '../converters/work-time-converter';
import { Activity } from '../models/activity';
import { Week } from '../models/week';
import { activitiesCollectionName, workTimesCollectionName } from '../util/utils';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private todayActivitiesSubject?: ReplaySubject<Activity[]>;
  private lastWorkDayActivitiesSubject?: ReplaySubject<Activity[]>;

  get workTimeCollectionName(): string {
    return workTimesCollectionName(this.auth.currentUser!.uid)
  }

  get activityCollectionName(): string {
    return activitiesCollectionName(this.auth.currentUser!.uid)
  }

  constructor(private firestore: Firestore, private auth: Auth) {
    this.cleanupSubjectsOnAuthStateChange();
  }

  getTodayActivities$(): Observable<Activity[]> {
    if (!this.todayActivitiesSubject) {
      this.todayActivitiesSubject = new ReplaySubject(1);

      collectionData(
        query(
          collection(this.firestore, this.activityCollectionName).withConverter(activityConverter), where('date', '==', startOfToday())
        ),
        { idField: 'id' }
      ).subscribe(activities => this.todayActivitiesSubject?.next(activities))
    }

    return this.todayActivitiesSubject.asObservable();
  }

  getLastWorkDayActivities$(): Observable<Activity[]> {
    if (!this.lastWorkDayActivitiesSubject) {
      this.lastWorkDayActivitiesSubject = new ReplaySubject(1);

      collectionData(
        query(
          collection(this.firestore, this.workTimeCollectionName).withConverter(workTimeConverter), orderBy('start', 'desc'), where('start', '<', startOfToday()), limit(1)
        )
      )
        .pipe(
          map(workTimesList => workTimesList[0]),
          mergeMap(workTime => !!workTime 
            ? collectionData(
            query(
              collection(this.firestore, this.activityCollectionName).withConverter(activityConverter), where('date', '==', startOfDay(workTime.start))
            ),
            { idField: 'id' }
          ) 
          : of([]))
        )
        .subscribe(activities => this.lastWorkDayActivitiesSubject?.next(activities));
    }

    return this.lastWorkDayActivitiesSubject.asObservable();
  }

  getActivitiesByWeek$(week: Week): Observable<Activity[]> {
    return collectionData(
      query(
        collection(this.firestore, this.activityCollectionName).withConverter(activityConverter), where('date', '>=', week.start), where('date', '<=', week.end)
      ),
      { idField: 'id' }
    )
  }

  getActivityById$(id: string): Observable<Activity> {
    const docRef = doc(this.firestore, `${this.activityCollectionName}/${id}`).withConverter(activityConverter);
    return docData(docRef, { idField: 'id' });
  }

  create(data: Activity): Promise<any> {
    return addDoc(collection(this.firestore, this.activityCollectionName), { date: data.date, ticket: data.ticket, durationMinutes: data.durationMinutes, location: data.location, type: data.type });
  }

  update(activity: Activity): Promise<void> {
    return updateDoc(doc(this.firestore, `${this.activityCollectionName}/${activity.id}`), { ...activity });
  }

  delete(activity: Activity): Promise<void> {
    return deleteDoc(doc(this.firestore, `${this.activityCollectionName}/${activity.id}`))
  }

  private cleanupSubjectsOnAuthStateChange(): void {
    this.auth.beforeAuthStateChanged((state) => {
      if (!state) {
        this.cleanUpSubjects();
      }
    });
  }

  private cleanUpSubjects() {
    this.todayActivitiesSubject?.complete();
    this.todayActivitiesSubject = undefined;
    this.lastWorkDayActivitiesSubject?.complete();
    this.lastWorkDayActivitiesSubject = undefined;
  }
}
