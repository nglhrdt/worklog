import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CreateActivityComponent } from '../create-activity/create-activity.component';
import { ProfileComponent } from '../profile/profile.component';
import { TodayActivitiesComponent } from '../today-activities/today-activities.component';
import { TodaySummaryComponent } from '../today-summary/today-summary.component';
import { TodayWorkTimeListComponent } from '../today-work-time-list/today-work-time-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProfileComponent, TodaySummaryComponent, TodayActivitiesComponent, CreateActivityComponent, TodayWorkTimeListComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent { }
