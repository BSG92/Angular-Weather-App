import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { CurrentWeatherType } from '../models/currentWeather.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherNowService {
  constructor(private http: HttpClient) {}

  getCurrentWeatherData(
    lat: number,
    lon: number
  ): Observable<CurrentWeatherType> {
    return this.http.get<CurrentWeatherType>(environment.apiUrlWeatherNow, {
      params: new HttpParams()
        .set('lat', lat)
        .set('lon', lon)
        .set(environment.apiKeyName, environment.apiKeyValue as string),
    });
  }
}
