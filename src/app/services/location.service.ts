import { Injectable } from '@angular/core';
import { isEqual, startOfToday } from 'date-fns';
import { WorkingLocation } from '../models/activity';

const LOCATION_KEY = 'TODAY_LOCATION';
const DEFAULT_LOCATION = 'mobile';

interface LocationWithDate {
  location: WorkingLocation;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  getLocation(): WorkingLocation {
    return this.getLocationFromLocalStorage();
  }

  storeLocation(location: WorkingLocation): void {
    const locationWithDate: LocationWithDate = {
      location,
      date: startOfToday()
    };

    localStorage.setItem(LOCATION_KEY, JSON.stringify(locationWithDate));
  }

  private getLocationFromLocalStorage(): WorkingLocation {
    const locationFromStorage = localStorage.getItem(LOCATION_KEY);

    if (locationFromStorage !== null) {
      const locationWithDate: LocationWithDate = JSON.parse(locationFromStorage);
      if (isEqual(startOfToday(), new Date(locationWithDate.date))) {
        return locationWithDate.location;
      }
    }

    this.storeLocation(DEFAULT_LOCATION);
    return DEFAULT_LOCATION;
  }

}
