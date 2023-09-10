import { Component } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import cities from '../assets/countries.min.json';
import { CityData, lookupViaCity } from 'city-timezones';
import { GeolocationService } from './services/geolocation.service';
import { GeoLocationType } from './models/geolocation.model';
import is_typeCityData from './utils/isTypeCityData';

interface Type_CityCountry {
  city: string;
  country: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private geolocationService: GeolocationService) {}

  title = 'angular-weather-app';
  faSearch = faSearch;
  data: { [key: string]: string[] } = cities;
  searchTerm: string = '';
  filteredCities: Type_CityCountry[] = [];
  timezoneData: CityData[] | GeoLocationType[] = [];
  currentTimeOfCity: string = '';
  isCitySelected: boolean = false;
  isFetching: boolean = false;
  hasGeoLocationData: boolean = false; // For child components

  onSearchFocus(event: FocusEvent) {
    (event.target as HTMLInputElement).select();
  }

  // helper function wrapped
  isTypeCityData(obj: any): obj is CityData {
    return is_typeCityData(obj);
  }

  filterData() {
    this.filteredCities = [];
    this.isCitySelected = false;

    if (this.searchTerm.length < 3) {
      // This is to improve performance
      return;
    }

    for (const country in this.data) {
      const _cities = this.data[country];
      for (const city of _cities) {
        if (city.toLowerCase().includes(this.searchTerm.toLowerCase())) {
          this.filteredCities.push({ city, country });
        }
      }
    }
  }

  onCitySelected(selected: Type_CityCountry) {
    this.timezoneData = [];
    this.searchTerm = selected.city + ', ' + selected.country;
    this.filteredCities = [];
    this.currentTimeOfCity = '';
    this.isCitySelected = true;
    const timezone = lookupViaCity(selected.city);
    // console.log('timezone', timezone);
    if (timezone.length > 0) {
      this.hasGeoLocationData = true;
      (this.timezoneData as CityData[]).push(...timezone);

      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone[0].timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'long',
        hour12: false,
        // timeStyle: 'full'
      };
      const formatter = new Intl.DateTimeFormat('en-EN', options);
      this.currentTimeOfCity = formatter.format(new Date());
      // console.log(this.currentTimeOfCity);
    } else {
      this.timezoneData = [];
      this.hasGeoLocationData = false;
    }
    // console.log(timezone);
  }

  callGeolocationApi() {
    const city = this.searchTerm.split(',')[0].toLowerCase();
    if (city !== undefined && city !== '') {
      this.isFetching = true;
      this.hasGeoLocationData = false;
      this.geolocationService.getGeoLocationData(city).subscribe((geoData) => {
        this.timezoneData = []; // this cannot be at the top
        if (geoData instanceof Array) {
          // Usually, the api always returns an array
          (this.timezoneData as GeoLocationType[]).push(...geoData);
        } else {
          (this.timezoneData as GeoLocationType[]).push(geoData);
        }
        // this.cdr.detectChanges();
        // console.log('getting geo location for', this.timezoneData);
        this.isFetching = false;
        this.hasGeoLocationData = true;
      });
    }
  }
}
