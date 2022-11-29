import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service';
import { WorkTimeService } from 'src/app/services/work-time.service';

import { CreateActivityComponent } from './create-activity.component';

describe('CreateActivityComponent', () => {
  let component: CreateActivityComponent;
  let fixture: ComponentFixture<CreateActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateActivityComponent],
      providers: [
        { provide: WorkTimeService, useValue: jasmine.createSpyObj({ getNormalizedOpenWorkTime$: of(0) }) },
        { provide: ActivityService, useValue: jasmine.createSpyObj({ getTodayActivities$: of([])})},
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
