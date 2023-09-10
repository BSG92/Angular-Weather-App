import { CityData } from "city-timezones";
// Helper function with Type Guard
export default function is_typeCityData(obj: any): obj is CityData {
    return 'lng' in obj;
  }