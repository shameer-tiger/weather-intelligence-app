import React, { useState } from 'react';
import { DailyForecastData, HourlyForecastData, UnitSystem } from '../types';
import { formatTemp, formatDate, formatTime } from '../utils/units';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Calendar, Clock } from 'lucide-react';

interface TemperatureTrendChartProps {
  daily: DailyForecastData;
  hourly: HourlyForecastData;
  unit: UnitSystem;
  timezone?: string;
}

export const TemperatureTrendChart: React.FC<TemperatureTrendChartProps> = ({
  daily,
  hourly,
  unit,
  timezone,
}) => {
  const [viewMode, setViewMode] = useState<'7day' | '24hour'>('7day');

  // Prepare 7-day data
  const dailyChartData = (daily.time || []).slice(0, 7).map((timeStr, idx) => {
    const rawMax = daily.temperature_2m_max[idx] ?? 0;
    const rawMin = daily.temperature_2m_min[idx] ?? 0;
    const maxVal = unit === 'imperial' ? Math.round((rawMax * 9) / 5 + 32) : Math.round(rawMax);
    const minVal = unit === 'imperial' ? Math.round((rawMin * 9) / 5 + 32) : Math.round(rawMin);

    return {
      day: idx === 0 ? 'Today' : formatDate(timeStr, timezone, { weekday: 'short' }),
      date: formatDate(timeStr, timezone, { month: 'short', day: 'numeric' }),
      maxTemp: maxVal,
      minTemp: minVal,
      rawMax,
      rawMin,
      precip: daily.precipitation_sum[idx] ?? 0,
    };
  });

  // Prepare 24-hour data
  const hourlyChartData = (hourly.time || []).slice(0, 24).map((timeStr, idx) => {
    const rawTemp = hourly.temperature_2m[idx] ?? 0;
    const tempVal = unit === 'imperial' ? Math.round((rawTemp * 9) / 5 + 32) : Math.round(rawTemp);

    return {
      time: idx === 0 ? 'Now' : formatTime(timeStr, timezone),
      temp: tempVal,
      rawTemp,
      pop: hourly.precipitation_probability?.[idx] ?? 0,
    };
  });

  const unitLabel = `°${unit === 'imperial' ? 'F' : 'C'}`;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Temperature Trend Analysis
        </h3>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs font-semibold border border-slate-700/60">
          <button
            onClick={() => setViewMode('7day')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === '7day'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> 7-Day Outlook
          </button>
          <button
            onClick={() => setViewMode('24hour')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === '24hour'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> 24-Hour Curve
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === '7day' ? (
            <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="maxTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#64748b" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit={unitLabel} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 text-white p-3 rounded-xl text-xs space-y-1 shadow-2xl border border-slate-800">
                        <div className="font-bold border-b border-slate-800 pb-1 mb-1">
                          {data.day} ({data.date})
                        </div>
                        <div className="text-rose-400 font-semibold">
                          High: {formatTemp(data.rawMax, unit)}
                        </div>
                        <div className="text-blue-400 font-semibold">
                          Low: {formatTemp(data.rawMin, unit)}
                        </div>
                        {data.precip > 0 && (
                          <div className="text-sky-300">
                            Precip: {data.precip.toFixed(1)} mm
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="maxTemp"
                name="High Temp"
                stroke="#f43f5e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#maxTempGrad)"
              />
              <Area
                type="monotone"
                dataKey="minTemp"
                name="Low Temp"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#minTempGrad)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#64748b" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit={unitLabel} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 text-white p-3 rounded-xl text-xs space-y-1 shadow-2xl border border-slate-800">
                        <div className="font-bold border-b border-slate-800 pb-1 mb-1">
                          Time: {data.time}
                        </div>
                        <div className="text-blue-400 font-semibold">
                          Temp: {formatTemp(data.rawTemp, unit)}
                        </div>
                        <div className="text-sky-300">
                          Rain Chance: {data.pop}%
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                name="Temperature"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#hourlyGrad)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
