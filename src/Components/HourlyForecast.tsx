import React from 'react';
import { HourlyForecastData, UnitSystem } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWmoInfo } from '../utils/wmoCodes';
import { formatTemp, formatTime } from '../utils/units';
import { Clock, Droplets } from 'lucide-react';

interface HourlyForecastProps {
  hourly: HourlyForecastData;
  unit: UnitSystem;
  timezone?: string;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit, timezone }) => {
  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Show next 24 hours
  const hoursToShow = hourly.time.slice(0, 24);

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          24-Hour Forecast
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Scroll for timeline →
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
        {hoursToShow.map((timeStr, idx) => {
          const temp = hourly.temperature_2m[idx];
          const code = hourly.weather_code[idx] ?? 0;
          const pop = hourly.precipitation_probability?.[idx] ?? 0;
          const wmo = getWmoInfo(code);

          const isCurrentHour = idx === 0;
          const formattedHour = isCurrentHour ? 'Now' : formatTime(timeStr, timezone);

          return (
            <div
              key={`hourly-${timeStr}-${idx}`}
              className={`flex-shrink-0 w-24 p-3.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all ${
                isCurrentHour
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-500'
                  : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200'
              }`}
            >
              <div className={`text-xs font-bold ${isCurrentHour ? 'text-blue-100' : 'text-slate-400'}`}>
                {formattedHour}
              </div>

              <div className="my-2 p-1.5 rounded-xl bg-slate-900/60 backdrop-blur-sm">
                <WeatherIcon name={wmo.iconName} className="w-8 h-8" />
              </div>

              <div className={`text-base font-black ${isCurrentHour ? 'text-white' : 'text-white'}`}>
                {formatTemp(temp, unit)}
              </div>

              {pop > 0 ? (
                <div className={`flex items-center gap-0.5 text-[11px] font-bold mt-1 ${isCurrentHour ? 'text-blue-100' : 'text-blue-400'}`}>
                  <Droplets className="w-3 h-3" />
                  <span>{pop}%</span>
                </div>
              ) : (
                <div className={`text-[10px] font-medium mt-1 ${isCurrentHour ? 'text-blue-200' : 'text-slate-500'}`}>
                  0%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
