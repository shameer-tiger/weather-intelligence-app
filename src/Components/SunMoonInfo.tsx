import React from 'react';
import { DailyForecastData } from '../types';
import { formatTime } from '../utils/units';
import { Sunrise, Sunset, Sun, Moon, Clock } from 'lucide-react';

interface SunMoonInfoProps {
  daily: DailyForecastData;
  timezone?: string;
  currentTimeIso?: string;
}

export const SunMoonInfo: React.FC<SunMoonInfoProps> = ({
  daily,
  timezone,
  currentTimeIso,
}) => {
  const sunriseStr = daily?.sunrise?.[0];
  const sunsetStr = daily?.sunset?.[0];

  if (!sunriseStr || !sunsetStr) return null;

  const sunriseDate = new Date(sunriseStr);
  const sunsetDate = new Date(sunsetStr);
  const currentDate = currentTimeIso ? new Date(currentTimeIso) : new Date();

  const totalDaylightMs = Math.max(0, sunsetDate.getTime() - sunriseDate.getTime());
  const hours = Math.floor(totalDaylightMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalDaylightMs % (1000 * 60 * 60)) / (1000 * 60));

  // Calculate daylight progress percentage
  let progressPct = 0;
  if (currentDate.getTime() >= sunsetDate.getTime()) {
    progressPct = 100;
  } else if (currentDate.getTime() <= sunriseDate.getTime()) {
    progressPct = 0;
  } else {
    const elapsed = currentDate.getTime() - sunriseDate.getTime();
    progressPct = Math.round((elapsed / totalDaylightMs) * 100);
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" />
          Sun & Daylight Cycle
        </h3>
        <span className="text-xs font-semibold text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-800/50">
          {hours}h {minutes}m Daylight
        </span>
      </div>

      {/* Visual Arc Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-300">
          <div className="flex items-center gap-1">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <span>Sunrise: {formatTime(sunriseStr, timezone)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Sunset className="w-4 h-4 text-orange-400" />
            <span>Sunset: {formatTime(sunsetStr, timezone)}</span>
          </div>
        </div>

        <div className="h-3 rounded-full bg-slate-800 relative overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium pt-1">
          <span>Dawn</span>
          <span>
            {progressPct === 100
              ? 'Night Sky'
              : progressPct === 0
              ? 'Before Sunrise'
              : `Sun Progress: ${progressPct}%`}
          </span>
          <span>Dusk</span>
        </div>
      </div>
    </div>
  );
};
