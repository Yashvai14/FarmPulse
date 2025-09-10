"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import NavBar from "@/components/navBar";

const DynamicMap = dynamic(() => import("@/components/MapComponent"), { ssr: false });

type LocationData = {
  lat: number;
  lon: number;
  address?: string;
};

type WeatherData = {
  main?: { 
    temp?: number; 
    humidity?: number; 
    pressure?: number; 
    feels_like?: number;
  };
  weather?: { 
    description?: string;
    main?: string;
    icon?: string;
  }[];
  wind?: {
    speed?: number;
    deg?: number;
  };
};

type SoilData = {
  daily?: {
    soil_temperature_0_to_7cm?: number[];
    soil_moisture_0_to_7cm?: number[];
    soil_temperature_7_to_28cm?: number[];
    soil_moisture_7_to_28cm?: number[];
  };
};

type EnvironmentalTip = {
  title: string;
  description: string;
  icon: string;
  type: 'info' | 'warning' | 'success';
};

export default function FarmMapPage() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [environmentalTips, setEnvironmentalTips] = useState<EnvironmentalTip[]>([]);
  const [manualLocation, setManualLocation] = useState({ lat: '', lon: '' });

  const WEATHER_API = process.env.NEXT_PUBLIC_OPENWEATHER_KEY || "969319db1fb8e194b5d514f495cbdb5d";

  const generateEnvironmentalTips = (weather: WeatherData | null, soil: SoilData | null): EnvironmentalTip[] => {
    const tips: EnvironmentalTip[] = [];
    
    // Weather-based tips
    if (weather?.main?.temp) {
      if (weather.main.temp > 35) {
        tips.push({
          title: "High Temperature Alert",
          description: "Consider increasing irrigation and providing shade for sensitive crops.",
          icon: "🌡️",
          type: "warning"
        });
      } else if (weather.main.temp < 10) {
        tips.push({
          title: "Cold Weather Protection",
          description: "Protect crops from frost and consider covering sensitive plants.",
          icon: "❄️",
          type: "warning"
        });
      } else if (weather.main.temp >= 20 && weather.main.temp <= 30) {
        tips.push({
          title: "Optimal Growing Conditions",
          description: "Perfect temperature range for most crop activities.",
          icon: "🌱",
          type: "success"
        });
      }
    }
    
    // Humidity-based tips
    if (weather?.main?.humidity) {
      if (weather.main.humidity > 80) {
        tips.push({
          title: "High Humidity Detected",
          description: "Monitor for fungal diseases and ensure good air circulation.",
          icon: "💧",
          type: "warning"
        });
      } else if (weather.main.humidity < 30) {
        tips.push({
          title: "Low Humidity Alert",
          description: "Consider increasing irrigation frequency to prevent plant stress.",
          icon: "🏜️",
          type: "info"
        });
      }
    }
    
    // Soil moisture tips
    const soilMoisture = soil?.daily?.soil_moisture_0_to_7cm?.[0];
    if (soilMoisture !== undefined) {
      if (soilMoisture < 0.2) {
        tips.push({
          title: "Low Soil Moisture",
          description: "Soil appears dry. Consider irrigation to maintain crop health.",
          icon: "🌵",
          type: "warning"
        });
      } else if (soilMoisture > 0.4) {
        tips.push({
          title: "High Soil Moisture",
          description: "Good moisture levels detected. Monitor for potential waterlogging.",
          icon: "💦",
          type: "success"
        });
      }
    }
    
    return tips;
  };

  const getLocationFromCoords = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return `${data[0].name}, ${data[0].state || ''} ${data[0].country}`;
      }
    } catch (error) {
      console.error('Error getting location name:', error);
    }
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  };

  // 1. Get user location
  useEffect(() => {
    const getCurrentLocation = async () => {
      setLoading(true);
      setError(null);
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            const address = await getLocationFromCoords(coords.lat, coords.lon);
            setLocation({ ...coords, address });
            setLoading(false);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setError('Unable to get your location. You can enter coordinates manually.');
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    };
    
    getCurrentLocation();
  }, []);

  const handleManualLocation = async () => {
    const lat = parseFloat(manualLocation.lat);
    const lon = parseFloat(manualLocation.lon);
    
    if (isNaN(lat) || isNaN(lon)) {
      setError('Please enter valid coordinates.');
      return;
    }
    
    setLoading(true);
    const address = await getLocationFromCoords(lat, lon);
    setLocation({ lat, lon, address });
    setError(null);
    setLoading(false);
  };

  // 2. Fetch weather + soil data
  useEffect(() => {
    if (!location) return;

    const fetchData = async () => {
      try {
        // Weather data
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_API}&units=metric`
        );
        
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          setWeather(weatherData);
        } else {
          console.error('Weather API error:', weatherRes.statusText);
        }
        
        // Soil data
        const soilRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=soil_temperature_0_to_7cm,soil_moisture_0_to_7cm,soil_temperature_7_to_28cm,soil_moisture_7_to_28cm&timezone=auto`
        );
        
        if (soilRes.ok) {
          const soilData = await soilRes.json();
          setSoil(soilData);
        } else {
          console.error('Soil API error:', soilRes.statusText);
        }
      } catch (error) {
        console.error('Error fetching environmental data:', error);
      }
    };
    
    fetchData();
  }, [location]);

  // 3. Update environmental tips when data changes
  useEffect(() => {
    if (weather || soil) {
      const tips = generateEnvironmentalTips(weather, soil);
      setEnvironmentalTips(tips);
    }
  }, [weather, soil]);

  // ✅ Safely extract soil data
  const soilTemp = soil?.daily?.soil_temperature_0_to_7cm?.[0] ?? null;
  const soilMoisture = soil?.daily?.soil_moisture_0_to_7cm?.[0] ?? null;
  const soilTempDeep = soil?.daily?.soil_temperature_7_to_28cm?.[0] ?? null;
  const soilMoistureDeep = soil?.daily?.soil_moisture_7_to_28cm?.[0] ?? null;

  const getTipTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-teal-100 p-4 rounded-2xl mr-4">
                  <span className="text-4xl">🗺️</span>
                </div>
                <div>
                  <h1 className="text-5xl lg:text-6xl text-teal-600 font-bold mb-4">Farm Environmental Map</h1>
                  <p className="text-xl text-gray-600 max-w-2xl">
                    Visualize your farm's location with real-time environmental data and insights.
                  </p>
                </div>
              </div>
            </div>

            {/* Location Input */}
            {error && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Manual Location Entry</h3>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      placeholder="e.g., 21.1458"
                      value={manualLocation.lat}
                      onChange={(e) => setManualLocation({...manualLocation, lat: e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      placeholder="e.g., 79.0882"
                      value={manualLocation.lon}
                      onChange={(e) => setManualLocation({...manualLocation, lon: e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <button
                    onClick={handleManualLocation}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Set Location
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mb-4"></div>
                <p className="text-teal-600 font-medium">Detecting your location and fetching environmental data...</p>
              </div>
            )}

            {/* Main Content */}
            {location && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map Section */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-teal-100 p-2 rounded-lg">
                        <span className="text-xl">🗺️</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-teal-700">Farm Location</h3>
                        <p className="text-gray-600 text-sm">
                          {location.address || `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`}
                        </p>
                      </div>
                    </div>
                    <div className="h-96 bg-gray-100 rounded-xl overflow-hidden">
                      <DynamicMap lat={location.lat} lon={location.lon} />
                    </div>
                  </div>
                </div>

                {/* Environmental Data */}
                <div className="space-y-6">
                  {/* Weather Card */}
                  {weather && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <span className="text-xl">🌦️</span>
                        </div>
                        <h3 className="text-lg font-bold text-blue-700">Weather Conditions</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Temperature:</span>
                          <span className="font-semibold">{weather.main?.temp?.toFixed(1) ?? "N/A"}°C</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Feels Like:</span>
                          <span className="font-semibold">{weather.main?.feels_like?.toFixed(1) ?? "N/A"}°C</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Humidity:</span>
                          <span className="font-semibold">{weather.main?.humidity ?? "N/A"}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Condition:</span>
                          <span className="font-semibold capitalize">{weather.weather?.[0]?.description ?? "N/A"}</span>
                        </div>
                        {weather.wind?.speed && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Wind Speed:</span>
                            <span className="font-semibold">{weather.wind.speed.toFixed(1)} m/s</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Soil Data Card */}
                  {soil && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <span className="text-xl">🌍</span>
                        </div>
                        <h3 className="text-lg font-bold text-yellow-700">Soil Analysis</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-2">Surface Layer (0-7cm)</div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-yellow-50 p-3 rounded-lg">
                              <div className="text-xs text-gray-500">Temperature</div>
                              <div className="font-semibold">{soilTemp?.toFixed(1) ?? "N/A"}°C</div>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg">
                              <div className="text-xs text-gray-500">Moisture</div>
                              <div className="font-semibold">{soilMoisture?.toFixed(3) ?? "N/A"} m³/m³</div>
                            </div>
                          </div>
                        </div>
                        
                        {(soilTempDeep || soilMoistureDeep) && (
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-2">Deep Layer (7-28cm)</div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-yellow-50 p-3 rounded-lg">
                                <div className="text-xs text-gray-500">Temperature</div>
                                <div className="font-semibold">{soilTempDeep?.toFixed(1) ?? "N/A"}°C</div>
                              </div>
                              <div className="bg-yellow-50 p-3 rounded-lg">
                                <div className="text-xs text-gray-500">Moisture</div>
                                <div className="font-semibold">{soilMoistureDeep?.toFixed(3) ?? "N/A"} m³/m³</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Environmental Tips */}
                  {environmentalTips.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                          <span className="text-xl">🌱</span>
                        </div>
                        <h3 className="text-lg font-bold text-emerald-700">Environmental Insights</h3>
                      </div>
                      <div className="space-y-3">
                        {environmentalTips.map((tip, index) => (
                          <div key={index} className={`p-4 rounded-lg border ${getTipTypeColor(tip.type)}`}>
                            <div className="flex items-start gap-3">
                              <span className="text-xl">{tip.icon}</span>
                              <div>
                                <h4 className="font-semibold text-sm">{tip.title}</h4>
                                <p className="text-sm mt-1">{tip.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
