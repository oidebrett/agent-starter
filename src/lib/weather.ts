export interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
}

export const getWeatherData = async (
  latitude: string,
  longitude: string,
): Promise<WeatherData> => {
  try {
    const lat = Number.parseFloat(latitude);
    const lon = Number.parseFloat(longitude);

    // Validate coordinates
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      console.error(`Invalid coordinates received: latitude="${latitude}", longitude="${longitude}"`);
      throw new Error(`Invalid coordinates: latitude="${latitude}", longitude="${longitude}". Both must be valid numbers.`);
    }

    if (lat < -90 || lat > 90) {
      throw new Error(`Latitude must be between -90 and 90. Received: ${lat}`);
    }

    if (lon < -180 || lon > 180) {
      throw new Error(`Longitude must be between -180 and 180. Received: ${lon}`);
    }

    // Using Open-Meteo API - free, no API key required, reliable
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`;

    console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);
    console.log(`Weather API URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Weather API error response: ${errorText}`);
      throw new Error(`Weather API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data?.current) {
      console.error("Invalid weather response:", JSON.stringify(data, null, 2));
      throw new Error("Weather API returned invalid data");
    }

    const current = data.current;

    // Map WMO weather codes to conditions
    const weatherCode = current.weather_code;
    const condition = getWeatherCondition(weatherCode);

    return {
      temperature: Math.round(current.temperature_2m),
      condition,
      windSpeed: Math.round(current.wind_speed_10m),
    };
  } catch (error) {
    console.error("Weather API error:", error);
    throw new Error("Failed to fetch weather data");
  }
};

// Map WMO weather codes to human-readable conditions
function getWeatherCondition(code: number): string {
  if (code === 0) return "clear";
  if (code <= 3) return "partly cloudy";
  if (code <= 48) return "foggy";
  if (code <= 67) return "rainy";
  if (code <= 77) return "snowy";
  if (code <= 82) return "rainy";
  if (code <= 86) return "snowy";
  if (code <= 99) return "stormy";
  return "unknown";
}

export const formatWeatherDisplay = (weather: WeatherData): string => {
  return `${weather.temperature}°F, ${weather.condition}, ${weather.windSpeed} mph wind`;
};
