import React from 'react';
import { AlertCircle, Search, RefreshCw, MapPin } from 'lucide-react';
import { LocationResult } from '../types';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  onSelectPopular?: (loc: LocationResult) => void;
}

const DEFAULT_POPULAR = [
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006, tz: 'America/New_York' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, tz: 'Europe/Paris' },
];

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'City not found. Please try another search.',
  onRetry,
  onSelectPopular,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl text-center space-y-6 animate-in fade-in duration-300">
      <div className="w-16 h-16 mx-auto rounded-full bg-rose-950/60 text-rose-400 border border-rose-800/80 flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">
          Location Search Issue
        </h3>
        <p className="text-sm font-medium text-slate-300 max-w-md mx-auto">
          {message}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}
      </div>

      {onSelectPopular && (
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Or select a popular city:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {DEFAULT_POPULAR.map((city) => (
              <button
                key={city.name}
                onClick={() =>
                  onSelectPopular({
                    id: Math.round(city.lat * 100 + city.lon * 100),
                    name: city.name,
                    country: city.country,
                    latitude: city.lat,
                    longitude: city.lon,
                    timezone: city.tz,
                  })
                }
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-all flex items-center gap-1.5 border border-slate-700"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
