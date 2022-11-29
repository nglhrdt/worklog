import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';

import { DailyComponent } from './daily.component';

describe('DailyComponent', () => {
  describe('activities given', () => {
    let component: DailyComponent;
    let fixture: ComponentFixture<DailyComponent>;
    let activityServiceSpy = jasmine.createSpyObj('ActivityService', {getLastWorkDayActivities$: of([new Activity(new Date(), 'ticket', 15, 'mobile', 'development', 'activity-1')])});

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DailyComponent, RouterTestingModule],
        providers: [
          { provide: ActivityService, useValue: activityServiceSpy }
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(DailyComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    beforeEach(() => {
      const activities: Activity[] = [new Activity(new Date(), 'ticket', 15, 'mobile', 'development', 'id')]
      activityServiceSpy.getLastWorkDayActivities$.and.returnValue(of(activities));
    })

    it('should show activity details', () => {
      const detailsComponents: HTMLElement[] = fixture.nativeElement.querySelectorAll('app-activity-details');
      expect(detailsComponents.length).toBe(1);
    })
  });

  describe('no activities given', () => {
    let component: DailyComponent;
    let fixture: ComponentFixture<DailyComponent>;
    let activityServiceSpy = jasmine.createSpyObj('ActivityService', {getLastWorkDayActivities$: of([])});

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DailyComponent, RouterTestingModule],
        providers: [
          { provide: ActivityService, useValue: activityServiceSpy }
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(DailyComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show message', () => {
      const noActivitiesMessage: HTMLElement = fixture.nativeElement.querySelector('#no-activities-message');
      expect(noActivitiesMessage?.innerHTML).toEqual('Work today and come back tomorrow. ;-)');
    });

    it('should have no activity details children', () => {
      const activityDetailsChildren: HTMLElement[] = fixture.nativeElement.querySelectorAll('app-activity-details');
      expect(activityDetailsChildren?.length).toEqual(0);
    });
  });
});
