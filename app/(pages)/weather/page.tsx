'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "@/components/navBar";

// TypeScript types for OpenWeather API
interface WeatherListItem {
  dt: number;
  main: { temp: number; feels_like: number; humidity: number; pressure: number; temp_min: number; temp_max: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  visibility: number;
}

interface WeatherData {
  list: WeatherListItem[];
  city: { name: string; country: string; sunrise: number; sunset: number };
}

interface AgriculturalAdvice {
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export default function WeatherPage() {
  const [city, setCity] = useState("Nagpur,IN");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agriculturalAdvice, setAgriculturalAdvice] = useState<AgriculturalAdvice[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<'metric' | 'imperial'>('metric');

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY || "969319db1fb8e194b5d514f495cbdb5d";

  const generateAgriculturalAdvice = (weatherData: WeatherData): AgriculturalAdvice[] => {
    const current = weatherData.list[0];
    const advice: AgriculturalAdvice[] = [];

    // Temperature-based advice
    if (current.main.temp > 35) {
      advice.push({
        title: "High Temperature Alert",
        description: "Increase irrigation frequency and provide shade for sensitive crops. Avoid midday field work.",
        icon: "🌡️",
        priority: "high"
      });
    }

    if (current.main.temp < 10) {
      advice.push({
        title: "Cold Weather Warning",
        description: "Protect crops from frost. Consider covering sensitive plants and delay sowing.",
        icon: "❄️",
        priority: "high"
      });
    }

    // Humidity-based advice
    if (current.main.humidity > 80) {
      advice.push({
        title: "High Humidity Detected",
        description: "Monitor crops for fungal diseases. Ensure good air circulation and avoid over-watering.",
        icon: "💧",
        priority: "medium"
      });
    }

    // Wind-based advice
    if (current.wind.speed > 10) {
      advice.push({
        title: "Strong Winds Expected",
        description: "Secure loose structures and support tall plants. Postpone spraying operations.",
        icon: "🌬️",
        priority: "medium"
      });
    }

    // Weather condition-based advice
    const condition = current.weather[0]?.main.toLowerCase();
    if (condition.includes('rain')) {
      advice.push({
        title: "Rainy Weather Forecast",
        description: "Delay harvest and field operations. Ensure proper drainage to prevent waterlogging.",
        icon: "🌧️",
        priority: "high"
      });
    }

    // Default positive advice if no alerts
    if (advice.length === 0 && current.main.temp >= 20 && current.main.temp <= 30 && current.main.humidity < 70) {
      advice.push({
        title: "Ideal Farming Conditions",
        description: "Perfect weather for most agricultural activities. Good time for planting, spraying, and harvesting.",
        icon: "☀️",
        priority: "low"
      });
    }

    return advice;
  };

  const fetchWeather = async (selectedCity: string) => {
    if (!API_KEY) {
      setError("API Key not configured!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=${selectedUnit}`
      );
      const weatherData = res.data;
      setWeather(weatherData);
      setAgriculturalAdvice(generateAgriculturalAdvice(weatherData));
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("City not found. Please check the city name and try again.");
      }
      setWeather(null);
      setAgriculturalAdvice([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (city.trim() !== "") fetchWeather(city);
  };

  const getWeatherIcon = (condition: string, iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '🌨️',
      'Mist': '🌫️',
      'Fog': '🌫️'
    };
    return iconMap[condition] || '☁️';
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-2xl mr-4">
                  <span className="text-4xl">🌤️</span>
                </div>
                <div>
                  <h1 className="text-5xl lg:text-6xl text-blue-600 font-bold mb-4">Agricultural Weather</h1>
                  <p className="text-xl text-gray-600 max-w-2xl">
                    Get precise weather forecasts and agricultural advisories for better farm management.
                  </p>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 mb-8">
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city name (e.g., Mumbai, Delhi)"
                      className="w-full border-2 border-blue-200 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-400 transition-colors text-lg"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value as 'metric' | 'imperial')}
                      className="border-2 border-blue-200 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-400 transition-colors"
                    >
                      <option value="metric">Celsius</option>
                      <option value="imperial">Fahrenheit</option>
                    </select>
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Get Weather'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                <p className="text-blue-600 font-medium">Fetching weather data...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-8">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Weather Data */}
            {weather && !loading && (
              <div className="space-y-8">
                {/* Current Weather Card */}
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl shadow-xl p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Section - Current Weather */}
                    <div className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start mb-4">
                        <span className="text-6xl mr-4">
                          {getWeatherIcon(weather.list[0]?.weather[0]?.main, weather.list[0]?.weather[0]?.icon)}
                        </span>
                        <div>
                          <div className="text-6xl lg:text-7xl font-bold">
                            {Math.round(weather.list[0]?.main.temp ?? 0)}°{selectedUnit === 'metric' ? 'C' : 'F'}
                          </div>
                          <div className="text-lg opacity-90 capitalize">
                            {weather.list[0]?.weather[0]?.description ?? "-"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">{weather.city.name}, {weather.city.country}</h2>
                        <p className="text-lg opacity-90">
                          Feels like {Math.round(weather.list[0]?.main.feels_like ?? 0)}°{selectedUnit === 'metric' ? 'C' : 'F'}
                        </p>
                        <p className="opacity-80">
                          {new Date().toLocaleDateString('en-IN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Right Section - Weather Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-2xl mb-2">💧</div>
                        <div className="text-sm opacity-80">Humidity</div>
                        <div className="text-xl font-semibold">{weather.list[0]?.main.humidity ?? 0}%</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-2xl mb-2">💨</div>
                        <div className="text-sm opacity-80">Wind Speed</div>
                        <div className="text-xl font-semibold">{weather.list[0]?.wind.speed ?? 0} m/s</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-2xl mb-2">🌡️</div>
                        <div className="text-sm opacity-80">High/Low</div>
                        <div className="text-xl font-semibold">
                          {Math.round(weather.list[0]?.main.temp_max ?? 0)}°/{Math.round(weather.list[0]?.main.temp_min ?? 0)}°
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="text-sm opacity-80">Pressure</div>
                        <div className="text-xl font-semibold">{weather.list[0]?.main.pressure ?? 0} hPa</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agricultural Advisory */}
                {agriculturalAdvice.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-green-100 p-3 rounded-xl">
                        <span className="text-2xl">🌾</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-green-700">Agricultural Advisory</h3>
                        <p className="text-gray-600">Weather-based farming recommendations</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {agriculturalAdvice.map((advice, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-xl border-l-4 ${
                            advice.priority === 'high' 
                              ? 'bg-red-50 border-red-400' 
                              : advice.priority === 'medium' 
                              ? 'bg-yellow-50 border-yellow-400' 
                              : 'bg-green-50 border-green-400'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{advice.icon}</span>
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">{advice.title}</h4>
                              <p className="text-gray-600 text-sm">{advice.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hourly Forecast */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-blue-700 mb-6">24-Hour Forecast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {weather.list.slice(0, 6).map((hour, i) => (
                      <div key={i} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl text-center border border-blue-100">
                        <div className="text-sm text-gray-600 mb-2">
                          {formatTime(hour.dt)}
                        </div>
                        <div className="text-3xl mb-2">
                          {getWeatherIcon(hour.weather[0].main, hour.weather[0].icon)}
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {Math.round(hour.main.temp)}°
                        </div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">
                          {hour.weather[0].description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5-Day Forecast */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-blue-700 mb-6">5-Day Forecast</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {weather.list
                      .filter((_, i) => i % 8 === 0)
                      .slice(0, 5)
                      .map((day, i) => (
                        <div key={i} className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl text-center border border-gray-100">
                          <div className="font-semibold text-gray-700 mb-2">
                            {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "numeric"
                            })}
                          </div>
                          <div className="text-4xl mb-3">
                            {getWeatherIcon(day.weather[0].main, day.weather[0].icon)}
                          </div>
                          <div className="text-xl font-bold text-blue-600 mb-1">
                            {Math.round(day.main.temp)}°
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {day.weather[0].description}
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            💧 {day.main.humidity}%
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
