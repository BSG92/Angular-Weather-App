import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GeoLocationType } from '../models/geolocation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private http: HttpClient) { }

  getGeoLocationData(city: string): Observable<GeoLocationType>{
    return this.http.get<GeoLocationType>(environment.apiUrlGeoLocation,{
      params: new HttpParams()
      .set('q', city)
      .set('limit', 1)
      .set(environment.apiKeyName, environment.apiKeyValue as string)
    })
  }
}
