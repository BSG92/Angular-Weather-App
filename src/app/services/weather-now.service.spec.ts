import { TestBed } from '@angular/core/testing';

import { WeatherNowService } from './weather-now.service';

describe('WeatherNowService', () => {
  let service: WeatherNowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherNowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
