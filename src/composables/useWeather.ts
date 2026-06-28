import { ref, computed, onMounted } from 'vue';
import {
  getWeather,
  getWeatherInfo,
  getWindDirection,
  type WeatherData,
} from '@/services/weatherService';

export interface Region {
  name: string;
  city: string;
  lat: number;
  lon: number;
  emoji: string;
  weather?: WeatherData;
  loading: boolean;
  error: string | null;
}

const REGIONS: Omit<Region, 'weather' | 'loading' | 'error'>[] = [
  {
    name: 'Sur',
    city: 'Montevideo',
    lat: -34.9011,
    lon: -56.1645,
    emoji: '🏙️',
  },
  { name: 'Este', city: 'Maldonado', lat: -34.902, lon: -54.9614, emoji: '🌊' },
  {
    name: 'Oeste',
    city: 'Paysandú',
    lat: -32.3167,
    lon: -58.0833,
    emoji: '🌾',
  },
  { name: 'Norte', city: 'Rivera', lat: -30.9053, lon: -55.5511, emoji: '🌿' },
];

export function useWeather() {
  const regions = ref<Region[]>(
    REGIONS.map((r) => ({
      ...r,
      weather: undefined,
      loading: true,
      error: null,
    })),
  );

  async function fetchAll() {
    await Promise.all(
      regions.value.map(async (region) => {
        region.loading = true;
        region.error = null;
        try {
          region.weather = await getWeather(region.lat, region.lon);
        } catch (e: any) {
          region.error = e.message;
        } finally {
          region.loading = false;
        }
      }),
    );
  }

  const nationalSummary = computed(() => {
    const loaded = regions.value.filter((r) => r.weather);
    if (!loaded.length) return null;

    const avg = (key: keyof WeatherData['current']) =>
      loaded.reduce((sum, r) => sum + (r.weather!.current[key] as number), 0) /
      loaded.length;

    return {
      temperature: avg('temperature_2m').toFixed(1),
      feelsLike: avg('apparent_temperature').toFixed(1),
      humidity: Math.round(avg('relative_humidity_2m')),
      windSpeed: avg('wind_speed_10m').toFixed(1),
      uvIndex: avg('uv_index').toFixed(1),
      cloudCover: Math.round(avg('cloud_cover')),
      pressure: Math.round(avg('surface_pressure')),
    };
  });

  onMounted(() => fetchAll());

  return {
    regions,
    nationalSummary,
    fetchAll,
    getWeatherInfo,
    getWindDirection,
  };
}
