import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Hero Card Skeleton */}
      <div className="h-80 rounded-3xl bg-slate-900/80 border border-slate-800 p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-800 rounded" />
            <div className="h-8 w-56 bg-slate-800 rounded-lg" />
          </div>
          <div className="h-8 w-28 bg-slate-800 rounded-full" />
        </div>

        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-800" />
          <div className="space-y-2">
            <div className="h-12 w-36 bg-slate-800 rounded-lg" />
            <div className="h-4 w-28 bg-slate-800 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="h-12 bg-slate-800 rounded-xl" />
          <div className="h-12 bg-slate-800 rounded-xl" />
          <div className="h-12 bg-slate-800 rounded-xl" />
          <div className="h-12 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Hourly Skeleton */}
      <div className="h-44 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="h-5 w-40 bg-slate-800 rounded" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-24 h-24 bg-slate-800 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="h-96 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="h-5 w-48 bg-slate-800 rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-800 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};
