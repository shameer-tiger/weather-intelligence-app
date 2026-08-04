import { WeatherData, PlanningRecommendation, UnitSystem } from '../types';
import { formatTemp, formatWindSpeed } from './units';

export function generateRecommendations(data: WeatherData, unit: UnitSystem): PlanningRecommendation[] {
  const recs: PlanningRecommendation[] = [];
  const curr = data.current;
  const todayMax = data.daily.temperature_2m_max[0] ?? curr.temperature;
  const todayMin = data.daily.temperature_2m_min[0] ?? curr.temperature;
  const precipSum = data.daily.precipitation_sum[0] ?? 0;
  const precipProb = data.daily.precipitation_probability_max?.[0] ?? (precipSum > 0 ? 80 : 0);
  const uvMax = data.daily.uv_index_max[0] ?? curr.uv_index;
  const maxWind = data.daily.wind_speed_10m_max[0] ?? curr.wind_speed;

  // 1. Clothing Recommendation
  if (todayMin < 5) { // < 41°F
    recs.push({
      id: 'clothing-heavy',
      category: 'clothing',
      title: 'Heavy Cold Weather Apparel Required',
      description: `Temperatures dipping down to ${formatTemp(todayMin, unit)}. Wear a heavy winter coat, thermal layers, scarf, and insulated gloves.`,
      iconName: 'Shirt',
      severity: 'warning',
      actionTag: 'Thermal Outerwear',
    });
  } else if (todayMin < 15) { // 41°F - 59°F
    recs.push({
      id: 'clothing-medium',
      category: 'clothing',
      title: 'Layered Clothing & Light Jacket',
      description: `Brisk conditions expected (${formatTemp(todayMin, unit)} - ${formatTemp(todayMax, unit)}). A jacket, fleece layer, or sweater is recommended.`,
      iconName: 'Shirt',
      severity: 'info',
      actionTag: 'Light Jacket',
    });
  } else if (todayMax > 28) { // > 82°F
    recs.push({
      id: 'clothing-hot',
      category: 'clothing',
      title: 'Lightweight & Breathable Wear',
      description: `Warm conditions peaking at ${formatTemp(todayMax, unit)}. Choose light cotton or moisture-wicking fabrics and stay well hydrated.`,
      iconName: 'Sun',
      severity: 'success',
      actionTag: 'Summer Attire',
    });
  } else {
    recs.push({
      id: 'clothing-pleasant',
      category: 'clothing',
      title: 'Comfortable Moderate Apparel',
      description: `Mild temperatures (${formatTemp(todayMax, unit)} high). Standard shirt and casual pants or jeans will be comfortable today.`,
      iconName: 'Shirt',
      severity: 'info',
      actionTag: 'Casual Wear',
    });
  }

  // 2. Umbrella & Rain Recommendation
  if (precipSum > 5 || precipProb > 60) {
    recs.push({
      id: 'umbrella-high',
      category: 'umbrella',
      title: 'High Chance of Rain – Bring Waterproof Gear',
      description: `Expect substantial rain today (~${precipSum.toFixed(1)}mm / ${precipProb}% chance). Keep a broad umbrella or hooded raincoat nearby.`,
      iconName: 'Umbrella',
      severity: 'alert',
      actionTag: 'Umbrella Essential',
    });
  } else if (precipSum > 0.5 || precipProb > 30) {
    recs.push({
      id: 'umbrella-mod',
      category: 'umbrella',
      title: 'Possible Light Showers',
      description: `Passing drizzles or light rain possible (${precipProb}% chance). A compact umbrella or water-resistant jacket is advised.`,
      iconName: 'CloudRain',
      severity: 'warning',
      actionTag: 'Compact Umbrella',
    });
  } else {
    recs.push({
      id: 'umbrella-none',
      category: 'umbrella',
      title: 'Dry Conditions Ahead',
      description: 'Minimal to no rain expected today. No umbrella needed for your outdoor commute.',
      iconName: 'CloudSun',
      severity: 'success',
      actionTag: 'No Rain Expected',
    });
  }

  // 3. Sun & UV Protection
  if (uvMax >= 8) {
    recs.push({
      id: 'uv-extreme',
      category: 'sun_uv',
      title: `Very High UV Index (${uvMax.toFixed(1)})`,
      description: 'Unprotected skin can burn quickly. Apply broad-spectrum SPF 30+ sunscreen, wear UV-blocking sunglasses and a broad-brimmed hat.',
      iconName: 'SunMedium',
      severity: 'warning',
      actionTag: 'SPF 30+ & Shades',
    });
  } else if (uvMax >= 5) {
    recs.push({
      id: 'uv-mod',
      category: 'sun_uv',
      title: `Moderate Sun Exposure (UV ${uvMax.toFixed(1)})`,
      description: 'Sun protection is recommended during midday hours (10:00 AM - 4:00 PM) when outside.',
      iconName: 'Sun',
      severity: 'info',
      actionTag: 'Sunscreen Recommended',
    });
  }

  // 4. Outdoor Activities & Fitness
  if (curr.weather_code === 0 || curr.weather_code === 1 || curr.weather_code === 2) {
    if (todayMax >= 15 && todayMax <= 26 && maxWind < 25) {
      recs.push({
        id: 'activity-optimal',
        category: 'activities',
        title: 'Ideal for Outdoor Sports & Running',
        description: `Excellent conditions with comfortable temperatures (${formatTemp(todayMax, unit)}) and low wind. Great day for cycling, jogging, or picnics.`,
        iconName: 'Footprints',
        severity: 'success',
        actionTag: 'Great for Fitness',
      });
    }
  }

  // 5. Wind Safety / Extreme Weather
  if (maxWind > 40) {
    recs.push({
      id: 'wind-strong',
      category: 'wind_safety',
      title: `Strong Gusty Winds (${formatWindSpeed(maxWind, unit)})`,
      description: 'Hold onto lightweight items outdoors. Exercise caution while driving high-profile vehicles or cycling in open areas.',
      iconName: 'Wind',
      severity: 'warning',
      actionTag: 'High Wind Caution',
    });
  }

  return recs;
}
