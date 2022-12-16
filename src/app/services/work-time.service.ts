import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, deleteDoc, doc, docData, Firestore, limit, limitToLast, orderBy, query, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { addMinutes, endOfToday, setSeconds, startOfToday, startOfTomorrow } from 'date-fns';
import { BehaviorSubject, combineLatest, first, map, Observable, ReplaySubject, timer } from 'rxjs';
import { workTimeConverter } from '../converters/work-time-converter';
import { Week } from '../models/week';
import { WorkTime } from '../models/work-time';
import { normalizeToFifteenMinutes, workTimesCollectionName } from '../util/utils';
import { ActivityService } from './activity.service';

export type PresenceState = 'present' | 'absent';

export const DAILY_WORK_TIME = 480;

@Injectable({
  providedIn: 'root'
})
export class WorkTimeService {
  private reloadPresenceTimer$ = new BehaviorSubject(true);

  private lastTenWorkTimeEntriesSubject?: ReplaySubject<WorkTime[]>;
  private todayWorkTimeEntriesSubject?: ReplaySubject<WorkTime[]>;
  private lastWorkTimeEntrySubject?: ReplaySubject<WorkTime>;
  private presenceTimeSubject?: ReplaySubject<number>;
  private weekPresenceTimeSubject?: ReplaySubject<number>;
  private presenceStateSubject?: ReplaySubject<PresenceState>
  private normalizedOpenTimeSubject?: ReplaySubject<number>;
  private openTimeSubject?: ReplaySubject<number>;
  private eveningDateSubject?: ReplaySubject<Date>;

  get collectionName(): string {
    return workTimesCollectionName(this.auth.currentUser!.uid);
  }

  constructor(private firestore: Firestore, private activityService: ActivityService, private auth: Auth) {
    this.startDurationReloadTimer();
    this.cleanupSubjectsOnAuthStateChange();
  }

  getEveningDate$(): Observable<Date> {
    if (!this.eveningDateSubject) {
      this.eveningDateSubject = new ReplaySubject(1);

      this.getPresenceTime$()
        .pipe(map((presenceMinutes) => addMinutes(new Date(), DAILY_WORK_TIME - presenceMinutes)))
        .subscribe(eveningDate => this.eveningDateSubject?.next(eveningDate));
    }

    return this.eveningDateSubject.asObservable();
  }

  getOpenTime$(): Observable<number> {
    if (!this.openTimeSubject) {
      this.openTimeSubject = new ReplaySubject(1);

      this.getPresenceTime$()
        .pipe(
          map((presenceMinutes) => DAILY_WORK_TIME - presenceMinutes < 0 ? 0 : DAILY_WORK_TIME - presenceMinutes)
        )
        .subscribe(openTime => this.openTimeSubject?.next(openTime));
    }

    return this.openTimeSubject.asObservable();
  }

  getNormalizedOpenWorkTime$(): Observable<number> {
    if (!this.normalizedOpenTimeSubject) {
      this.normalizedOpenTimeSubject = new ReplaySubject(1);

      const todayActivityDuration$ = this.getOverallTodayActivityDuration();
      const presenceTime$ = this.getPresenceTime$();

      combineLatest([
        todayActivityDuration$,
        presenceTime$
      ])
        .pipe(
          map(([overallActivityDuration, presenceTime]) => (presenceTime ?? 0) - overallActivityDuration),
          map(openTime => normalizeToFifteenMinutes(openTime))
        )
        .subscribe(openTime => this.normalizedOpenTimeSubject?.next(openTime));
    }

    return this.normalizedOpenTimeSubject.asObservable();
  }

  private getOverallTodayActivityDuration(): Observable<number> {
    return this.activityService
      .getTodayActivities$()
      .pipe(
        map(activities => activities.reduce((overallDurationMinutes, activity) => overallDurationMinutes += activity.durationMinutes, 0))
      );
  }

  getPresenceState$(): Observable<PresenceState | undefined> {
    if (!this.presenceStateSubject) {
      this.presenceStateSubject = new ReplaySubject(1);

      this.getLastWorkTimeEntry$()
        .pipe(
          map((entry?) => {
            if (!entry) {
              return 'absent';
            }
            return entry.end ? 'absent' : 'present'
          })
        )
        .subscribe(state => this.presenceStateSubject?.next(state));
    }

    return this.presenceStateSubject.asObservable();
  }

  getPresenceTime$(): Observable<number> {
    if (!this.presenceTimeSubject) {
      this.presenceTimeSubject = new ReplaySubject(1);

      const workTimeList: Observable<WorkTime[]> =
        collectionData(
          query(
            collection(this.firestore, this.collectionName).withConverter(workTimeConverter),
            where('start', '>=', startOfToday()),
            where('start', '<', startOfTomorrow())
          ),
          { idField: 'id' }
        );

      combineLatest([this.reloadPresenceTimer$, workTimeList])
        .pipe(
          map(([_, workTimeList]) => this.getWorkTimeListDuration(workTimeList)),
        )
        .subscribe(presenceTime => this.presenceTimeSubject?.next(presenceTime));
    }

    return this.presenceTimeSubject.asObservable();
  }

  getWeekPresenceTime$(): Observable<number> {
    if (!this.weekPresenceTimeSubject) {
      this.weekPresenceTimeSubject = new ReplaySubject(1);

      const week: Week = new Week();

      const workTimeList: Observable<WorkTime[]> =
        collectionData(
          query(
            collection(this.firestore, this.collectionName).withConverter(workTimeConverter),
            where('start', '>=', week.start),
            where('start', '<', week.end)
          ),
          { idField: 'id' }
        );

      combineLatest([this.reloadPresenceTimer$, workTimeList])
        .pipe(
          map(([_, workTimeList]) => this.getWorkTimeListDuration(workTimeList)),
        )
        .subscribe(presenceTime => this.weekPresenceTimeSubject?.next(presenceTime));
    }

    return this.weekPresenceTimeSubject.asObservable();
  }

  getLastTenWorkTimeEntries$(): Observable<WorkTime[]> {
    if (!this.lastTenWorkTimeEntriesSubject) {
      this.lastTenWorkTimeEntriesSubject = new ReplaySubject(1);

      collectionData(
        query(
          collection(this.firestore, this.collectionName).withConverter(workTimeConverter),
          orderBy('start', 'desc'),
          limit(10)
        ),
        { idField: 'id' }
      )
        .subscribe(workTimeList => this.lastTenWorkTimeEntriesSubject?.next(workTimeList));
    }

    return this.lastTenWorkTimeEntriesSubject.asObservable();
  }

  getTodayWorkTimeEntries$(): Observable<WorkTime[]> {
    if (!this.todayWorkTimeEntriesSubject) {
      this.todayWorkTimeEntriesSubject = new ReplaySubject(1);

      collectionData(
        query(
          collection(this.firestore, this.collectionName).withConverter(workTimeConverter),
          orderBy('start', 'desc'),
          where('start', '>=', startOfToday()),
          where('start', '<=', endOfToday())
        ),
        { idField: 'id' }
      )
        .subscribe(workTimeList => this.todayWorkTimeEntriesSubject?.next(workTimeList));
    }

    return this.todayWorkTimeEntriesSubject.asObservable();
  }

  getWorkTime$(start: Date, end: Date): Observable<WorkTime[]> {
    return collectionData(
      query(
        collection(this.firestore, this.collectionName).withConverter(workTimeConverter),
        orderBy('start', 'desc'),
        where('start', '>=', start),
        where('start', '<=', end)
      ),
      { idField: 'id' }
    );
  }

  getLastWorkTimeEntry$(): Observable<WorkTime | undefined> {
    if (!this.lastWorkTimeEntrySubject) {

      this.lastWorkTimeEntrySubject = new ReplaySubject(1);

      collectionData(
        query(
          collection(this.firestore, this.collectionName).withConverter(workTimeConverter),
          orderBy('start', 'asc'),
          limitToLast(1)
        ),
        { idField: 'id' }
      )
        .pipe(map(r => r[0]))
        .subscribe(workTime => this.lastWorkTimeEntrySubject?.next(workTime))
    }

    return this.lastWorkTimeEntrySubject.asObservable();
  }

  private startDurationReloadTimer() {
    const nextReloadAt = setSeconds(addMinutes(new Date(), 1), 0);

    timer(nextReloadAt)
      .pipe(first())
      .subscribe(() => {
        this.reloadPresenceTimer$?.next(true);
        this.startDurationReloadTimer();
      });
  }

  private getWorkTimeListDuration(workTimeList: WorkTime[]): number {
    return workTimeList.reduce((duration, workTime) => duration += workTime.getDurationInMinutes(), 0);
  }

  getById$(workTimeId: string): Observable<WorkTime> {
    const docRef = doc(this.firestore, `${this.collectionName}/${workTimeId}`).withConverter(workTimeConverter);
    return docData(docRef, { idField: 'id' });
  }

  delete(entry: WorkTime): Promise<void> {
    return deleteDoc(doc(this.firestore, `${this.collectionName}/${entry.id}`));
  }

  update(entry: WorkTime): Promise<void> {
    if (entry.hasOwnProperty('end') && !entry.end) {
      delete entry.end;
    }
    return updateDoc(doc(this.firestore, `${this.collectionName}/${entry.id}`), { ...entry });
  }

  createBatch(workTimeList: WorkTime[]): Promise<void> {
    const batch = writeBatch(this.firestore);

    workTimeList.forEach((wt) => {
      const docRef = doc(collection(this.firestore, `${this.collectionName}`)).withConverter(workTimeConverter);
      batch.set(docRef, <WorkTime>{ start: wt.start, type: wt.type, end: wt.end })
    });

    return batch.commit();
  }

  private cleanupSubjectsOnAuthStateChange(): void {
    this.auth.beforeAuthStateChanged((state) => {
      if (!state) {
        this.cleanUpSubjects();
      }
    });
  }

  private cleanUpSubjects(): void {
    this.lastTenWorkTimeEntriesSubject?.complete();
    this.lastTenWorkTimeEntriesSubject = undefined;
    this.todayWorkTimeEntriesSubject?.complete();
    this.todayWorkTimeEntriesSubject = undefined;
    this.lastWorkTimeEntrySubject?.complete();
    this.lastWorkTimeEntrySubject = undefined;
    this.presenceTimeSubject?.complete();
    this.presenceTimeSubject = undefined;
    this.weekPresenceTimeSubject?.complete();
    this.weekPresenceTimeSubject = undefined;
    this.presenceStateSubject?.complete();
    this.presenceStateSubject = undefined;
    this.normalizedOpenTimeSubject?.complete();
    this.normalizedOpenTimeSubject = undefined;
    this.openTimeSubject?.complete();
    this.openTimeSubject = undefined;
  }
}
