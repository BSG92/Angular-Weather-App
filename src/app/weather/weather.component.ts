import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WeatherNowService } from '../services/weather-now.service';
import { CityData } from 'city-timezones';
import { GeoLocationType } from '../models/geolocation.model';
import is_typeCityData from '../utils/isTypeCityData';
import { CurrentWeatherType } from '../models/currentWeather.model';

interface IconMapType {
  [key: string ]: string;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})

export class WeatherComponent implements OnChanges {
  constructor(private currentWeatherService: WeatherNowService) {}

  @Input() city_data: CityData[] | GeoLocationType[] | undefined;
  @Input() has_geolocation_data: boolean | undefined;

  hasGeoLocationData: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName === 'city_data') {
        const change = changes[propName];
        if (change.currentValue.length > 0) {
          if (is_typeCityData(change.currentValue[0])) {
            this.geoData.lat = change.currentValue[0].lat;
            this.geoData.lon = change.currentValue[0].lng;
            // console.log('onChange CityData', { lat, lon });
          } else {
            this.geoData.lat = change.currentValue[0].lat;
            this.geoData.lon = change.currentValue[0].lon;
            // console.log('onChange GeoLocationType', { lat, lon });
          }

          this.callWeatherNowApi();
        }
      }
      if(propName === 'has_geolocation_data'){
        this.hasGeoLocationData = changes[propName].currentValue;
        // console.log('has geoData', changes[propName].currentValue)
      }
    }
  }

  icons = {
    iconUrl: '../../assets/weather-icons/',
    iconMap: {
      "01d" : 'sun.png',
      "02d" : 'cloudy.png',
      "03d" : 'clouds.png',
      "04d" : 'heavy-clouds.png',
      "09d" : 'heavy-rain.png',
      "10d" : 'cloudy-rain.png',
      "11d" : 'heavy-storm.png',
      "13d" : 'snow.png',
      "50d" : 'mist.png',
      "01n" : 'sun.png',
      "02n" : 'night-clouds.png',
      "03n" : 'night-clouds.png',
      "04n" : 'night-heavy-clouds.png',
      "09n" : 'night-heavy-rain.png',
      "10n" : 'heavy-rain.png',
      "11n" : 'storm.png',
      "13n" : 'night-snow.png',
      "50n" : 'night-mist.png',
      "undefined": 'cloud-error.png'
      // "01d" : '01d.png',
      // "02d" : '02d.png',
      // "03d" : '03d.png',
      // "04d" : '04d.png',
      // "09d" : '09d.png',
      // "10d" : '10d.png',
      // "11d" : '11d.png',
      // "13d" : '13d.png',
      // "50d" : '50d.png'
    } as IconMapType,
  };

  /* START: helper functions */

  /* helper function wrapped */
  isTypeCityData(obj: any): obj is CityData {
    return is_typeCityData(obj);
  }

  getIconUrl(iconCode: string| undefined): string {
    if (iconCode !== undefined)
      return this.icons.iconUrl + this.icons.iconMap[iconCode];
    return this.icons.iconUrl + this.icons.iconMap['undefined'];;
  }

  kelvin2Celcius(kelvin: number): {celcius: string, color: string}{
    // if(kelvin !== undefined) return (kelvin - 273.15).toFixed(1);
    if(kelvin !== undefined) {
      const celcius = (kelvin - 273.15);
      let color:string = '';
      if (celcius < -17) {
        color = 'ice-cold';
      }else if(celcius < 6) {
        color = 'cold';
      }else if(celcius <= 21) {
        color = 'warm';
      }else if(celcius <= 26){
        color = 'hot';
      }else {
        color = 'damn-hot';
      }
      return {celcius: celcius.toFixed(1), color: color}

    }
    return {celcius: "-0", color: ''};
  }

  getTimeZoneOffsetHours_Minutes(offsetInSeconds: number): string{
    const sign = offsetInSeconds >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offsetInSeconds) / 3600);
    const minutes = Math.floor((Math.abs(offsetInSeconds) % 3600) / 60);

    return `${sign}${hours.toString()}:${minutes.toString()}`
  }
  /* END: helper functions */

  isFetching: boolean = false;
  geoData = { lat: 0, lon: 0 };
  weatherData: CurrentWeatherType | null = null;

  convertEpochToUTC(epoch: number | undefined): string {
    // console.log("from weather now", this.city_data);
    if (epoch !== undefined) {
      const timezoneOffsetInSeconds = this.weatherData?.timezone;
      let date;
      if(timezoneOffsetInSeconds !== undefined){
      date = new Date((epoch + timezoneOffsetInSeconds) * 1000);
        return date.getUTCHours() + ' : ' + date.getUTCMinutes();
      }
      // return localeDate.getHours().toString() + ":" + localeDate.getMinutes().toString();
    }
    return '';
  }

  callWeatherNowApi() {
    this.isFetching = true;
    // console.log('fetching weather');
    if (this.city_data && this.city_data.length > 0) {
      this.currentWeatherService
        .getCurrentWeatherData(this.geoData.lat, this.geoData.lon)
        .subscribe((weatherData) => {
          this.weatherData = weatherData;
          this.isFetching = false;
        });
    }
  }
}
