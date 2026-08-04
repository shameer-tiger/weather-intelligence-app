import React, { useState } from 'react';
import { WeatherData, UnitSystem } from '../types';
import { generateRecommendations } from '../utils/recommendations';
import { WeatherIcon } from './WeatherIcon';
import { Lightbulb, Filter, ShieldCheck, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface PlanningRecommendationsProps {
  data: WeatherData;
  unit: UnitSystem;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  data,
  unit,
}) => {
  const recommendations = generateRecommendations(data, unit);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredRecs =
    activeCategory === 'all'
      ? recommendations
      : recommendations.filter((r) => r.category === activeCategory);

  const severityBadge = (severity: string) => {
    switch (severity) {
      case 'alert':
        return {
          bg: 'bg-rose-950/60 text-rose-300 border-rose-800/80',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'Alert',
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Caution',
        };
      case 'success':
        return {
          bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Optimal',
        };
      default:
        return {
          bg: 'bg-blue-950/60 text-blue-300 border-blue-800/80',
          icon: <Info className="w-3.5 h-3.5 text-blue-400" />,
          label: 'Advice',
        };
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-900/40 text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Smart Planning Recommendations
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Automated advice based on weather parameters
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs font-semibold">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All ({recommendations.length})
          </button>
          <button
            onClick={() => setActiveCategory('clothing')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeCategory === 'clothing'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Clothing
          </button>
          <button
            onClick={() => setActiveCategory('umbrella')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeCategory === 'umbrella'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Rain & Gear
          </button>
          <button
            onClick={() => setActiveCategory('sun_uv')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeCategory === 'sun_uv'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Sun & UV
          </button>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {filteredRecs.map((rec) => {
          const badge = severityBadge(rec.severity);

          return (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between space-y-3 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-blue-400 border border-slate-700 shrink-0">
                    <WeatherIcon name={rec.iconName} className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    {rec.title}
                  </h4>
                </div>

                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${badge.bg}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {rec.description}
              </p>

              <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-400 uppercase tracking-wider">
                  Action Tag
                </span>
                <span className="font-bold text-blue-300 bg-blue-900/40 px-2.5 py-0.5 rounded-md border border-blue-800/50">
                  {rec.actionTag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
