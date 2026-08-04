import React from 'react';
import { UnitSystem } from '../types';
import { CloudSun, Sparkles, RefreshCw } from 'lucide-react';

interface NavbarProps {
  unit: UnitSystem;
  onUnitToggle: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  unit,
  onUnitToggle,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#05070a]/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/25">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                Weather Intelligence
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Sparkles className="w-3 h-3" /> Live API
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-time forecast & AI planning
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh weather data"
              title="Refresh weather data"
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          )}

          {/* Unit Toggle Switch */}
          <div
            className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800"
            role="radiogroup"
            aria-label="Temperature Unit Selector"
          >
            <button
              onClick={() => unit !== 'metric' && onUnitToggle()}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                unit === 'metric'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              role="radio"
              aria-checked={unit === 'metric'}
            >
              °C <span className="hidden md:inline font-normal text-[10px] opacity-80">(Metric)</span>
            </button>
            <button
              onClick={() => unit !== 'imperial' && onUnitToggle()}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                unit === 'imperial'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              role="radio"
              aria-checked={unit === 'imperial'}
            >
              °F <span className="hidden md:inline font-normal text-[10px] opacity-80">(Imperial)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
