import API_KEY from ".env";

export const environment = {
    production: true,
    apiUrlGeoLocation: "http://api.openweathermap.org/geo/1.0/direct",
    apiUrlWeatherNow: "https://api.openweathermap.org/data/2.5/weather",
    apiKeyName: "appid",
    apiKeyValue: API_KEY,
  };