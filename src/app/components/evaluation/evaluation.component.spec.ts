import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service';

import { EvaluationComponent } from './evaluation.component';

describe('EvaluationComponent', () => {
  let component: EvaluationComponent;
  let fixture: ComponentFixture<EvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationComponent],
      providers: [
        { provide: ActivityService, useValue: jasmine.createSpyObj({ getActivitiesByWeek$: of([]) }) }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
