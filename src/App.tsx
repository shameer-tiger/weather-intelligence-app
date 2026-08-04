import React, { useState, useEffect, useCallback } from 'react';
import { LocationResult, WeatherData, UnitSystem } from './types';
import { fetchWeatherData, getLocationFromCoords, searchLocations } from './services/weatherApi';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecast } from './components/HourlyForecast';
import { SevenDayForecast } from './components/SevenDayForecast';
import { TemperatureTrendChart } from './components/TemperatureTrendChart';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { SunMoonInfo } from './components/SunMoonInfo';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorMessage } from './components/ErrorMessage';
import { CloudSun, Info, ShieldCheck } from 'lucide-react';

const DEFAULT_LOCATION: LocationResult = {
  id: 2643743,
  name: 'London',
  country: 'United Kingdom',
  latitude: 51.5074,
  longitude: -0.1278,
  timezone: 'Europe/London',
  admin1: 'England',
};

export default function App() {
  const [unit, setUnit] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem('weather_unit');
      return saved === 'imperial' ? 'imperial' : 'metric';
    } catch {
      return 'metric';
    }
  });

  const [currentLocation, setCurrentLocation] = useState<LocationResult>(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Unit toggle handler
  const handleUnitToggle = () => {
    const nextUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(nextUnit);
    try {
      localStorage.setItem('weather_unit', nextUnit);
    } catch {
      // Ignore
    }
  };

  // Main weather loader
  const loadWeather = useCallback(async (location: LocationResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
      setCurrentLocation(location);
    } catch (err: any) {
      console.error('Error fetching weather data:', err);
      setError('City not found. Please try another search.');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    // Attempt auto geolocation on initial mount if permission already granted or default to London
    if ('geolocation' in navigator) {
      navigator.permissions
        ?.query({ name: 'geolocation' })
        .then((result) => {
          if (result.state === 'granted') {
            handleGeolocation();
          } else {
            loadWeather(DEFAULT_LOCATION);
          }
        })
        .catch(() => loadWeather(DEFAULT_LOCATION));
    } else {
      loadWeather(DEFAULT_LOCATION);
    }
  }, [loadWeather]);

  // Geolocation button handler
  const handleGeolocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const loc = await getLocationFromCoords(latitude, longitude);
          await loadWeather(loc);
        } catch {
          setError('Could not identify location from coordinates.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (geoError) => {
        setIsLoadingLocation(false);
        console.warn('Geolocation denied or failed:', geoError);
        // If initial load failed, fallback gracefully
        if (!weatherData) {
          loadWeather(DEFAULT_LOCATION);
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 font-sans transition-colors selection:bg-blue-500 selection:text-white pb-16 relative overflow-x-hidden">
      {/* Immersive UI Ambient Glow Backdrops */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation */}
      <Navbar
        unit={unit}
        onUnitToggle={handleUnitToggle}
        onRefresh={() => loadWeather(currentLocation)}
        isRefreshing={isLoading}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Search & Location Bar */}
        <section aria-label="Location Search Section">
          <SearchBar
            onSelectLocation={loadWeather}
            onUseGeolocation={handleGeolocation}
            isLoadingLocation={isLoadingLocation}
          />
        </section>

        {/* Content States */}
        {isLoading && !weatherData ? (
          <SkeletonLoader />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => loadWeather(currentLocation)}
            onSelectPopular={loadWeather}
          />
        ) : weatherData ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Primary Hero Weather Card */}
            <section aria-label="Current Weather Summary">
              <CurrentWeatherCard data={weatherData} unit={unit} />
            </section>

            {/* Smart Planning Recommendations Section */}
            <section aria-label="Smart Planning Recommendations">
              <PlanningRecommendations data={weatherData} unit={unit} />
            </section>

            {/* 24-Hour Timeline Forecast */}
            <section aria-label="24-Hour Forecast">
              <HourlyForecast
                hourly={weatherData.hourly}
                unit={unit}
                timezone={weatherData.timezone}
              />
            </section>

            {/* Grid Layout: 7-Day Forecast & Trend Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* 7-Day Outlook */}
              <section aria-label="7-Day Weather Forecast">
                <SevenDayForecast
                  daily={weatherData.daily}
                  unit={unit}
                  timezone={weatherData.timezone}
                />
              </section>

              {/* Temperature Trend Analytics & Sun Cycle */}
              <div className="space-y-8">
                <section aria-label="Temperature Trend Chart">
                  <TemperatureTrendChart
                    daily={weatherData.daily}
                    hourly={weatherData.hourly}
                    unit={unit}
                    timezone={weatherData.timezone}
                  />
                </section>

                <section aria-label="Sun and Daylight Cycle">
                  <SunMoonInfo
                    daily={weatherData.daily}
                    timezone={weatherData.timezone}
                    currentTimeIso={weatherData.current.time}
                  />
                </section>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800/80 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-2 font-medium text-slate-300">
          <CloudSun className="w-4 h-4 text-blue-400" />
          <span>Powered by Open-Meteo Weather APIs & Geocoding Service</span>
        </div>
        <p className="text-slate-500">Real-time meteorological forecast & intelligence analysis • Free & open public API</p>
      </footer>
    </div>
  );
}
