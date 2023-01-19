import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBuilding } from '@fortawesome/free-regular-svg-icons';
import { faHome, faLaptopCode, faUsersBetweenLines } from '@fortawesome/free-solid-svg-icons';
import { Activity } from 'src/app/models/activity';
import { MinutesToHoursAndMinutesPipe } from 'src/app/pipes/minutes-to-hours-and-minutes.pipe';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-activity-details',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule, RouterLink, MinutesToHoursAndMinutesPipe],
  providers: [MinutesToHoursAndMinutesPipe],
  templateUrl: './activity-details.component.html',
  styles: [':host {overflow: hidden;}']
})
export class ActivityDetailsComponent {
  @Input() activity!: Activity;
  development = faLaptopCode;
  meeting = faUsersBetweenLines;
  mobile = faHome;
  company = faBuilding;
}
