import { LocationResult, WeatherData } from '../types';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

export async function searchLocations(query: string): Promise<LocationResult[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `${GEOCODING_API}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch location data from Open-Meteo Geocoding API');
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.map((item: any) => ({
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    elevation: item.elevation,
    feature_code: item.feature_code,
    country_code: item.country_code,
    admin1: item.admin1,
    admin2: item.admin2,
    country: item.country,
    timezone: item.timezone || 'auto',
    population: item.population,
  }));
}

export async function fetchWeatherData(location: LocationResult): Promise<WeatherData> {
  const { latitude, longitude, timezone } = location;

  const url = `${FORECAST_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,uv_index,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset&timezone=${encodeURIComponent(timezone || 'auto')}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather forecast (HTTP ${response.status})`);
  }

  const data = await response.json();

  const current = data.current || {};
  const hourly = data.hourly || {
    time: [],
    temperature_2m: [],
    apparent_temperature: [],
    relative_humidity_2m: [],
    precipitation_probability: [],
    weather_code: [],
    uv_index: [],
    wind_speed_10m: [],
  };
  const daily = data.daily || {
    time: [],
    weather_code: [],
    temperature_2m_max: [],
    temperature_2m_min: [],
    precipitation_sum: [],
    precipitation_probability_max: [],
    wind_speed_10m_max: [],
    uv_index_max: [],
    sunrise: [],
    sunset: [],
  };

  // Find UV index for current hour if available
  let currentUv = 0;
  if (hourly.time && hourly.uv_index && current.time) {
    const currentIndex = hourly.time.findIndex((t: string) => t.startsWith(current.time.substring(0, 13)));
    if (currentIndex !== -1 && hourly.uv_index[currentIndex] !== undefined) {
      currentUv = hourly.uv_index[currentIndex];
    } else if (daily.uv_index_max && daily.uv_index_max[0] !== undefined) {
      currentUv = daily.uv_index_max[0];
    }
  }

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    timezone_abbreviation: data.timezone_abbreviation,
    elevation: data.elevation,
    location,
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      apparent_temperature: current.apparent_temperature ?? current.temperature_2m,
      weather_code: current.weather_code,
      wind_speed: current.wind_speed_10m ?? 0,
      wind_direction: current.wind_direction_10m,
      relative_humidity: current.relative_humidity_2m ?? 50,
      surface_pressure: current.surface_pressure ?? 1013,
      uv_index: currentUv,
      is_day: current.is_day ?? 1,
      precipitation: current.precipitation ?? 0,
    },
    hourly,
    daily,
  };
}

export async function getLocationFromCoords(lat: number, lon: number): Promise<LocationResult> {
  try {
    // Attempt reverse geocoding via Open-Meteo or fallback
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (res.ok) {
      const info = await res.json();
      const name = info.locality || info.city || info.principalSubdivision || 'Current Location';
      const country = info.countryName || '';
      return {
        id: Math.round(lat * 1000 + lon * 1000),
        name,
        latitude: lat,
        longitude: lon,
        admin1: info.principalSubdivision,
        country,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
      };
    }
  } catch {
    // Ignore and fallback
  }

  return {
    id: Math.round(lat * 1000 + lon * 1000),
    name: 'My Location',
    latitude: lat,
    longitude: lon,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
  };
}
