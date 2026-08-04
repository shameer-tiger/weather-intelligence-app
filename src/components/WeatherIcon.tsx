import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  CloudHail,
  Wind,
  Umbrella,
  Shirt,
  Footprints,
  SunMedium,
  SunDim,
  AlertTriangle,
  CheckCircle2,
  Info,
  Droplets,
  Gauge,
  Compass,
  Sunrise,
  Sunset,
  Thermometer,
  Eye,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  const props = { className, size };

  switch (name) {
    case 'Sun':
      return <Sun {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'SunDim':
      return <SunDim {...props} />;
    case 'CloudSun':
      return <CloudSun {...props} />;
    case 'CloudMoon':
      return <CloudMoon {...props} />;
    case 'Cloud':
      return <Cloud {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} />;
    case 'CloudRain':
    case 'CloudRainWind':
      return <CloudRain {...props} />;
    case 'CloudLightning':
      return <CloudLightning {...props} />;
    case 'Snowflake':
      return <Snowflake {...props} />;
    case 'CloudFog':
      return <CloudFog {...props} />;
    case 'CloudHail':
      return <CloudHail {...props} />;
    case 'Wind':
      return <Wind {...props} />;
    case 'Umbrella':
      return <Umbrella {...props} />;
    case 'Shirt':
      return <Shirt {...props} />;
    case 'Footprints':
      return <Footprints {...props} />;
    case 'SunMedium':
      return <SunMedium {...props} />;
    case 'AlertTriangle':
      return <AlertTriangle {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...props} />;
    case 'Info':
      return <Info {...props} />;
    case 'Droplets':
      return <Droplets {...props} />;
    case 'Gauge':
      return <Gauge {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'Sunrise':
      return <Sunrise {...props} />;
    case 'Sunset':
      return <Sunset {...props} />;
    case 'Thermometer':
      return <Thermometer {...props} />;
    case 'Eye':
      return <Eye {...props} />;
    default:
      return <Cloud {...props} />;
  }
};
