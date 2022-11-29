import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { NavigationService } from 'src/app/services/navigation.service';

import { WorkTimeService } from 'src/app/services/work-time.service';
import { ActivityEditComponent } from './activity-edit.component';

describe('ActivityEditComponent', () => {
  describe('activity exists', () => {
    let component: ActivityEditComponent;
    let fixture: ComponentFixture<ActivityEditComponent>;
    let activityServiceSpy = jasmine.createSpyObj({ getActivityById$: of(Activity.emptyActivity('mobile')) })
    let workTimeServiceSpy = jasmine.createSpyObj(['getNormalizedOpenWorkTime$']);

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ActivityEditComponent, RouterTestingModule],
        providers: [
          { provide: ActivityService, useValue: activityServiceSpy },
          { provide: WorkTimeService, useValue: workTimeServiceSpy },
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(ActivityEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show activity form', () => {
      const editFormElement: HTMLElement = fixture.nativeElement.querySelector('app-activity-form');
      expect(editFormElement).not.toBeNull();
    });
  });

  describe('activity does not exist', () => {
    let component: ActivityEditComponent;
    let fixture: ComponentFixture<ActivityEditComponent>;
    let activityServiceSpy = jasmine.createSpyObj({ getActivityById$: of(undefined) })
    let workTimeServiceSpy = jasmine.createSpyObj(['getNormalizedOpenWorkTime$']);

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ActivityEditComponent, RouterTestingModule],
        providers: [
          { provide: ActivityService, useValue: activityServiceSpy },
          { provide: WorkTimeService, useValue: workTimeServiceSpy },
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(ActivityEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });


    it('should show no activity message', () => {
      const messageElement: HTMLElement = fixture.nativeElement.querySelector('#no-activity-message');
      expect(messageElement.innerHTML).toEqual('No activity');
    });
  });

  describe('apply open time', () => {
    let component: ActivityEditComponent;
    let fixture: ComponentFixture<ActivityEditComponent>;
    let activityServiceSpy = jasmine.createSpyObj({
      getActivityById$: of(new Activity(new Date(), 'ticket', 15, 'mobile', 'development', 'activity-id-1')),
      delete: Promise.resolve(),
      update: Promise.resolve(),
    });
    let workTimeServiceSpy = jasmine.createSpyObj({ getNormalizedOpenWorkTime$: of(15) });
    let navigationServiceSpy = jasmine.createSpyObj({ back: () => { } });

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ActivityEditComponent, RouterTestingModule],
        providers: [
          { provide: ActivityService, useValue: activityServiceSpy },
          { provide: WorkTimeService, useValue: workTimeServiceSpy },
          { provide: NavigationService, useValue: navigationServiceSpy },
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(ActivityEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should add open time to activity', () => {
      component.applyOpenTime(component.activity!);
      expect(component.activity!.durationMinutes).toEqual(30);
      expect(activityServiceSpy.update).toHaveBeenCalledOnceWith(component.activity);
    });
  });

  describe('delete entry', () => {
    let component: ActivityEditComponent;
    let fixture: ComponentFixture<ActivityEditComponent>;
    let activityServiceSpy = jasmine.createSpyObj({
      getActivityById$: of(new Activity(new Date(), 'ticket', 15, 'mobile', 'development', 'activity-id-1')),
      delete: Promise.resolve(),
    });
    let navigationServiceSpy = jasmine.createSpyObj({ back: () => { } });
    let workTimeServiceSpy = jasmine.createSpyObj({ getNormalizedOpenWorkTime$: of(15) });

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ActivityEditComponent, RouterTestingModule],
        providers: [
          { provide: ActivityService, useValue: activityServiceSpy },
          { provide: NavigationService, useValue: navigationServiceSpy },
          { provide: WorkTimeService, useValue: workTimeServiceSpy },
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(ActivityEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should delete activity', fakeAsync(() => {
      component.delete(component.activity!);
      expect(activityServiceSpy.delete).toHaveBeenCalledOnceWith(component.activity);
      tick();
      expect(navigationServiceSpy.back).toHaveBeenCalledTimes(1);
    }));
  });
});
