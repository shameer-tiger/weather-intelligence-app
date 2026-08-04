export type UnitSystem = 'metric' | 'imperial';

export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string; // State or region
  admin2?: string;
  country?: string;
  timezone: string;
  population?: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed: number;
  wind_direction?: number;
  relative_humidity: number;
  surface_pressure: number;
  uv_index: number;
  is_day: number;
  precipitation: number;
}

export interface HourlyForecastData {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
  uv_index: number[];
  wind_speed_10m: number[];
}

export interface DailyForecastData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation?: string;
  elevation?: number;
  location: LocationResult;
  current: CurrentWeather;
  hourly: HourlyForecastData;
  daily: DailyForecastData;
}

export type RecommendationSeverity = 'info' | 'success' | 'warning' | 'alert';

export interface PlanningRecommendation {
  id: string;
  category: 'clothing' | 'umbrella' | 'activities' | 'sun_uv' | 'wind_safety';
  title: string;
  description: string;
  iconName: string;
  severity: RecommendationSeverity;
  actionTag: string;
}

export interface WmoCodeInfo {
  code: number;
  description: string;
  iconName: string;
  bgGradientLight: string;
  bgGradientDark: string;
  isRain: boolean;
  isSnow: boolean;
  isThunder: boolean;
  isExtreme: boolean;
}
