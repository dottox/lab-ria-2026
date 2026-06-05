export interface WeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    precipitation: number;
    precipitation_probability: number;
    weather_code: number;
    cloud_cover: number;
    uv_index: number;
    is_day: number;
    surface_pressure: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

export async function getWeather(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'wind_speed_10m',
      'wind_direction_10m',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'uv_index',
      'is_day',
      'surface_pressure',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'weather_code',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),
    timezone: 'America/Montevideo',
    forecast_days: '7',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error('Error al obtener el clima');
  return res.json();
}

export const weatherDescriptions: Record<
  number,
  { label: string; emoji: string }
> = {
  0: { label: 'Despejado', emoji: '☀️' },
  1: { label: 'Mayormente despejado', emoji: '🌤️' },
  2: { label: 'Parcialmente nublado', emoji: '⛅' },
  3: { label: 'Nublado', emoji: '☁️' },
  45: { label: 'Neblina', emoji: '🌫️' },
  48: { label: 'Neblina con escarcha', emoji: '🌫️' },
  51: { label: 'Llovizna leve', emoji: '🌦️' },
  53: { label: 'Llovizna moderada', emoji: '🌦️' },
  61: { label: 'Lluvia leve', emoji: '🌧️' },
  63: { label: 'Lluvia moderada', emoji: '🌧️' },
  65: { label: 'Lluvia intensa', emoji: '🌧️' },
  80: { label: 'Chaparrón leve', emoji: '🌦️' },
  81: { label: 'Chaparrón moderado', emoji: '⛈️' },
  82: { label: 'Chaparrón intenso', emoji: '⛈️' },
  95: { label: 'Tormenta', emoji: '⛈️' },
  96: { label: 'Tormenta con granizo', emoji: '⛈️' },
};

export function getWeatherInfo(code: number) {
  return weatherDescriptions[code] ?? { label: 'Desconocido', emoji: '🌡️' };
}

export function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(degrees / 45) % 8];
}
