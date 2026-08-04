import React, { useState } from 'react';
import { DailyForecastData, UnitSystem } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWmoInfo } from '../utils/wmoCodes';
import {
  formatTemp,
  formatPrecipitation,
  formatWindSpeed,
  formatDate,
  formatTime,
} from '../utils/units';
import { Calendar, Droplets, Sun, Wind, ChevronRight, X, Sunrise, Sunset } from 'lucide-react';

interface SevenDayForecastProps {
  daily: DailyForecastData;
  unit: UnitSystem;
  timezone?: string;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({ daily, unit, timezone }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);

  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Calculate overall min/max for temperature bar scale across 7 days
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const tempRange = allMax - allMin || 1;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          7-Day Forecast
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Click any day for full breakdown
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {daily.time.slice(0, 7).map((timeStr, idx) => {
          const maxTemp = daily.temperature_2m_max[idx];
          const minTemp = daily.temperature_2m_min[idx];
          const code = daily.weather_code[idx] ?? 0;
          const precipSum = daily.precipitation_sum[idx] ?? 0;
          const precipProb = daily.precipitation_probability_max?.[idx] ?? (precipSum > 0 ? 80 : 0);
          const maxWind = daily.wind_speed_10m_max[idx] ?? 0;
          const uvMax = daily.uv_index_max[idx] ?? 0;
          const wmo = getWmoInfo(code);

          const isToday = idx === 0;
          const dayLabel = isToday
            ? 'Today'
            : formatDate(timeStr, timezone, { weekday: 'short' });
          const dateLabel = formatDate(timeStr, timezone, { month: 'short', day: 'numeric' });

          // Temperature bar visual position
          const leftPercent = Math.max(0, Math.min(100, ((minTemp - allMin) / tempRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((maxTemp - allMin) / tempRange) * 100));
          const barWidth = Math.max(10, rightPercent - leftPercent);

          return (
            <button
              key={`day-${timeStr}-${idx}`}
              onClick={() => setSelectedDayIdx(idx)}
              className="w-full group text-left p-3.5 sm:p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Day & Condition */}
              <div className="flex items-center gap-3 min-w-[180px]">
                <div className="p-2 rounded-xl bg-slate-800 text-blue-400 border border-slate-700 shrink-0">
                  <WeatherIcon name={wmo.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    {dayLabel}
                    {isToday && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-900/80 text-blue-300 border border-blue-700/50">
                        NOW
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {dateLabel} • {wmo.description}
                  </div>
                </div>
              </div>

              {/* Rain & Wind summary */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-1 min-w-[70px]">
                  <Droplets className={`w-3.5 h-3.5 ${precipSum > 0 ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{precipProb}%</span>
                  {precipSum > 0 && (
                    <span className="text-[10px] font-normal text-slate-400">
                      ({formatPrecipitation(precipSum, unit)})
                    </span>
                  )}
                </div>

                <div className="hidden md:flex items-center gap-1 text-slate-400">
                  <Wind className="w-3.5 h-3.5 text-blue-400" />
                  <span>{formatWindSpeed(maxWind, unit)}</span>
                </div>
              </div>

              {/* Temperature Bar Visual */}
              <div className="flex items-center gap-3 sm:w-60">
                <span className="text-xs font-bold text-slate-400 w-10 text-right">
                  {formatTemp(minTemp, unit, false)}°
                </span>

                <div className="flex-1 h-2 rounded-full bg-slate-800 relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-rose-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-white w-10">
                  {formatTemp(maxTemp, unit, false)}°
                </span>

                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Details Modal */}
      {selectedDayIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-6 relative">
            <button
              type="button"
              onClick={() => setSelectedDayIdx(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close detailed day forecast modal"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const idx = selectedDayIdx;
              const dateStr = daily.time[idx];
              const code = daily.weather_code[idx] ?? 0;
              const wmo = getWmoInfo(code);
              const maxTemp = daily.temperature_2m_max[idx];
              const minTemp = daily.temperature_2m_min[idx];
              const precipSum = daily.precipitation_sum[idx] ?? 0;
              const precipProb = daily.precipitation_probability_max?.[idx] ?? (precipSum > 0 ? 80 : 0);
              const maxWind = daily.wind_speed_10m_max[idx] ?? 0;
              const uvMax = daily.uv_index_max[idx] ?? 0;
              const sunrise = daily.sunrise?.[idx];
              const sunset = daily.sunset?.[idx];

              return (
                <>
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-blue-900/40 text-blue-400 border border-blue-800/50">
                      <WeatherIcon name={wmo.iconName} className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-white">
                        {formatDate(dateStr, timezone, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </h4>
                      <p className="text-sm font-semibold text-blue-400">
                        {wmo.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                      <div className="text-xs text-slate-400 font-semibold uppercase">High Temp</div>
                      <div className="text-xl font-bold text-white mt-0.5">
                        {formatTemp(maxTemp, unit)}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                      <div className="text-xs text-slate-400 font-semibold uppercase">Low Temp</div>
                      <div className="text-xl font-bold text-white mt-0.5">
                        {formatTemp(minTemp, unit)}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                      <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" /> Precipitation
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {formatPrecipitation(precipSum, unit)} ({precipProb}%)
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                      <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5 text-blue-400" /> Max Wind
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {formatWindSpeed(maxWind, unit)}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                      <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-400" /> Max UV Index
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {uvMax.toFixed(1)}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                      <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
                        <Sunrise className="w-3.5 h-3.5 text-amber-400" /> Sunrise / Sunset
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        {sunrise ? formatTime(sunrise, timezone) : 'N/A'} - {sunset ? formatTime(sunset, timezone) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
