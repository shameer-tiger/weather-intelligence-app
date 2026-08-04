import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Navigation, History } from 'lucide-react';
import { LocationResult } from '../types';
import { searchLocations } from '../services/weatherApi';

interface SearchBarProps {
  onSelectLocation: (loc: LocationResult) => void;
  onUseGeolocation: () => void;
  isLoadingLocation?: boolean;
}

const POPULAR_CITIES = [
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006, tz: 'America/New_York' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, tz: 'Europe/Paris' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney' },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708, tz: 'Asia/Dubai' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectLocation,
  onUseGeolocation,
  isLoadingLocation = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<LocationResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weather_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveToRecent = (location: LocationResult) => {
    try {
      const updated = [location, ...recentSearches.filter((item) => item.id !== location.id)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Handle typing with debounce
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationResult) => {
    saveToRecent(loc);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    onSelectLocation(loc);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else if (query.trim().length >= 2) {
      // Fetch directly and select first
      setIsSearching(true);
      searchLocations(query)
        .then((results) => {
          if (results.length > 0) {
            handleSelect(results[0]);
          }
        })
        .finally(() => setIsSearching(false));
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto space-y-3">
      {/* Search Input Container */}
      <form onSubmit={handleFormSubmit} className="relative flex items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Search className="w-5 h-5" />}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search city or location (e.g., Tokyo, London, San Francisco)..."
            aria-label="Search city or location"
            className="w-full pl-11 pr-24 py-3.5 bg-slate-900/80 text-white rounded-2xl border border-slate-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-400 text-sm md:text-base font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="absolute inset-y-0 right-12 pr-3 flex items-center text-slate-400 hover:text-white"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          className="ml-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center shrink-0 text-sm"
          aria-label="Execute city search"
        >
          Search
        </button>

        {/* Geolocation Button */}
        <button
          type="button"
          onClick={onUseGeolocation}
          disabled={isLoadingLocation}
          title="Use Current Location"
          aria-label="Use my current GPS location"
          className="ml-2 p-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-medium rounded-2xl transition-all border border-slate-800 flex items-center justify-center shrink-0 active:scale-95 disabled:opacity-50"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          ) : (
            <Navigation className="w-5 h-5 text-blue-400" />
          )}
        </button>
      </form>

      {/* Auto-complete Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || (query.length >= 2 && !isSearching)) && (
        <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <button
                key={`${item.id}-${item.latitude}-${item.longitude}`}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-3 hover:bg-blue-900/30 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-blue-400 group-hover:bg-blue-600/30 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {item.name}
                      {item.admin1 ? `, ${item.admin1}` : ''}
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.country} {item.country_code ? `(${item.country_code})` : ''}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                </span>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-slate-400">
              No matching locations found for "<span className="font-semibold text-slate-200">{query}</span>"
            </div>
          )}
        </div>
      )}

      {/* Quick Location Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
          Quick Search:
        </span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={() =>
              handleSelect({
                id: Math.round(city.lat * 100 + city.lon * 100),
                name: city.name,
                country: city.country,
                latitude: city.lat,
                longitude: city.lon,
                timezone: city.tz,
              })
            }
            className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-medium transition-all active:scale-95 border border-slate-800"
          >
            {city.name}
          </button>
        ))}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="w-full flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <History className="w-3 h-3" /> Recent:
            </span>
            {recentSearches.map((rec) => (
              <button
                key={`recent-${rec.id}`}
                type="button"
                onClick={() => onSelectLocation(rec)}
                className="px-2.5 py-0.5 rounded-md bg-blue-950/50 hover:bg-blue-900/60 text-blue-300 font-medium transition-colors text-[11px] border border-blue-800/60"
              >
                {rec.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
