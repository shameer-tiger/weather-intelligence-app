import React from 'react';
import { WeatherData, UnitSystem } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWmoInfo } from '../utils/wmoCodes';
import {
  formatTemp,
  formatWindSpeed,
  formatPrecipitation,
  formatPressure,
  formatDate,
  formatTime,
  getWindDirectionName,
  getUvCategory,
} from '../utils/units';
import {
  MapPin,
  Wind,
  Droplets,
  Gauge,
  Sun,
  CloudRain,
  Compass,
  ArrowUp,
  ArrowDown,
  Calendar,
} from 'lucide-react';

interface CurrentWeatherCardProps {
  data: WeatherData;
  unit: UnitSystem;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, unit }) => {
  const { current, location, daily, timezone } = data;
  const wmo = getWmoInfo(current.weather_code, current.is_day);
  const todayMax = daily.temperature_2m_max[0] ?? current.temperature;
  const todayMin = daily.temperature_2m_min[0] ?? current.temperature;
  const uvInfo = getUvCategory(current.uv_index);
  const windDirName = getWindDirectionName(current.wind_direction);

  const formattedDate = formatDate(current.time || new Date().toISOString(), timezone, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = formatTime(current.time || new Date().toISOString(), timezone);

  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-black/50 transition-all duration-300`}>
      {/* Dynamic Background Glow Overlay */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header: Location & Time */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              {location.admin1 ? `${location.admin1}, ` : ''}
              {location.country || ''}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {location.name}
          </h2>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 text-slate-200 text-xs font-semibold backdrop-blur-sm border border-slate-700/70 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Local Time: {formattedTime}
          </div>
        </div>
      </div>

      {/* Main Temp & Condition Section */}
      <div className="relative z-10 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Temperature Display */}
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-3xl bg-slate-800/80 backdrop-blur-md shadow-lg border border-slate-700/70 text-blue-400 shrink-0">
            <WeatherIcon name={wmo.iconName} className="w-16 h-16 md:w-20 md:h-20" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl md:text-7xl font-black text-white tracking-tighter">
                {formatTemp(current.temperature, unit, false)}
              </span>
              <span className="text-2xl md:text-3xl font-bold text-slate-300">
                °{unit === 'imperial' ? 'F' : 'C'}
              </span>
            </div>
            <div className="text-base font-bold text-slate-100 mt-1">
              {wmo.description}
            </div>
            <div className="text-xs font-medium text-slate-400 mt-0.5">
              Feels like <span className="font-semibold text-slate-200">{formatTemp(current.apparent_temperature, unit)}</span>
            </div>
          </div>
        </div>

        {/* Right: High/Low & Day Badge */}
        <div className="flex flex-col md:items-end justify-center space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 text-amber-300 font-semibold text-sm border border-amber-500/20">
              <ArrowUp className="w-4 h-4 text-amber-400" />
              <span>High: {formatTemp(todayMax, unit)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-400/10 text-blue-300 font-semibold text-sm border border-blue-500/20">
              <ArrowDown className="w-4 h-4 text-blue-400" />
              <span>Low: {formatTemp(todayMin, unit)}</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-700/80">
            {current.is_day ? '☀️ Daylight Hours' : '🌙 Nighttime Sky'}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-4 border-t border-slate-800/80">
        {/* Wind Speed */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-900/50 text-blue-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Wind Speed
            </div>
            <div className="text-sm font-bold text-white">
              {formatWindSpeed(current.wind_speed, unit)}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <Compass className="w-3 h-3 text-blue-400" /> {windDirName} ({current.wind_direction ?? 0}°)
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-900/50 text-cyan-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Humidity
            </div>
            <div className="text-sm font-bold text-white">
              {Math.round(current.relative_humidity)}%
            </div>
            <div className="text-[10px] text-slate-400">
              {current.relative_humidity > 70 ? 'Humid' : current.relative_humidity < 30 ? 'Dry Air' : 'Comfortable'}
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-900/50 text-amber-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              UV Index
            </div>
            <div className="text-sm font-bold text-white">
              {current.uv_index.toFixed(1)}
            </div>
            <div className={`text-[10px] font-bold ${uvInfo.colorClass}`}>
              {uvInfo.label} Risk
            </div>
          </div>
        </div>

        {/* Pressure & Precip */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-900/50 text-indigo-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Pressure
            </div>
            <div className="text-sm font-bold text-white">
              {formatPressure(current.surface_pressure, unit)}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-blue-400" /> Precip: {formatPrecipitation(current.precipitation, unit)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
