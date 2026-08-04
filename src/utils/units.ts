import { UnitSystem } from '../types';

export function formatTemp(celsius: number, unit: UnitSystem, includeDegree = true): string {
  if (isNaN(celsius) || celsius === null || celsius === undefined) return '--';
  const val = unit === 'imperial' ? (celsius * 9) / 5 + 32 : celsius;
  const rounded = Math.round(val);
  return includeDegree ? `${rounded}°${unit === 'imperial' ? 'F' : 'C'}` : `${rounded}°`;
}

export function formatWindSpeed(kmh: number, unit: UnitSystem): string {
  if (isNaN(kmh) || kmh === null || kmh === undefined) return '--';
  if (unit === 'imperial') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecipitation(mm: number, unit: UnitSystem): string {
  if (isNaN(mm) || mm === null || mm === undefined) return '0 mm';
  if (unit === 'imperial') {
    const inches = (mm * 0.0393701).toFixed(2);
    return `${inches} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function formatPressure(hpa: number, unit: UnitSystem): string {
  if (isNaN(hpa) || hpa === null || hpa === undefined) return '--';
  if (unit === 'imperial') {
    const inhg = (hpa * 0.02953).toFixed(2);
    return `${inhg} inHg`;
  }
  return `${Math.round(hpa)} hPa`;
}

export function formatDate(dateStr: string, timezone?: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    const date = new Date(dateStr);
    const defaultOptions: Intl.DateTimeFormatOptions = options || {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    if (timezone) {
      defaultOptions.timeZone = timezone;
    }
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch {
    return dateStr;
  }
}

export function formatTime(isoStr: string, timezone?: string): string {
  try {
    const date = new Date(isoStr);
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    if (timezone) {
      options.timeZone = timezone;
    }
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return isoStr;
  }
}

export function getWindDirectionName(degree: number | undefined): string {
  if (degree === undefined || isNaN(degree)) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degree % 360) / 22.5) % 16;
  return directions[index];
}

export function getUvCategory(uv: number): { label: string; colorClass: string; barColor: string } {
  if (uv < 3) return { label: 'Low', colorClass: 'text-emerald-500', barColor: 'bg-emerald-500' };
  if (uv < 6) return { label: 'Moderate', colorClass: 'text-amber-500', barColor: 'bg-amber-500' };
  if (uv < 8) return { label: 'High', colorClass: 'text-orange-500', barColor: 'bg-orange-500' };
  if (uv < 11) return { label: 'Very High', colorClass: 'text-rose-500', barColor: 'bg-rose-500' };
  return { label: 'Extreme', colorClass: 'text-purple-600', barColor: 'bg-purple-600' };
}
