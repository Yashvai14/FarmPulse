'use client';

import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function WeatherPage() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const forecast = [
    { day: 'Mon', temp: '30°C', status: 'Sunny' },
    { day: 'Tue', temp: '32°C', status: 'Cloudy' },
    { day: 'Wed', temp: '29°C', status: 'Rain' },
    { day: 'Thu', temp: '31°C', status: 'Sunny' },
    { day: 'Fri', temp: '30°C', status: 'Cloudy' },
  ];

  const handleSearch = async () => {
    if (!location.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
      const data = await response.json();
      
      if (response.ok) {
        setWeatherData(data);
      } else {
        setError(data.error || 'Failed to fetch weather data');
      }
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Load default weather on component mount
  useEffect(() => {
    setLocation('Nagpur');
    handleSearch();
  }, []);
  };

  return (
    <main className='bg-gradient-to-br from-lime-50 to-green-50 min-h-screen'>
        <NavBar />
      <section className="max-w-5xl mx-auto text-center py-12 md:py-24 px-4">
        <h1 className="text-3xl md:text-6xl mb-6 md:mb-10 font-bold text-lime-500">Live Weather Forecast</h1>
        <p className="mt-4 text-gray-600 text-base md:text-lg max-w-xl mx-auto">
          Stay prepared with accurate and region-specific weather updates to protect your yield.
        </p>

        {/* Location Search */}
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
          <Input
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? 'Loading...' : 'Get Weather'}
          </Button>
        </div>
        
        {error && (
          <div className="mt-4 text-red-600 text-sm">{error}</div>
        )}
      </section>

      {/* Weather Card */}
      <section className="max-w-5xl mx-auto mb-10 px-4">
        {weatherData && (
          <div className="bg-white shadow-md rounded-xl p-4 md:p-6 mb-6 text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-green-700 mb-2">{weatherData.location}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base">
              <div>
                <p className="text-gray-700">Temperature: <strong>{weatherData.temp}</strong></p>
                <p className="text-gray-600">Condition: {weatherData.condition}</p>
              </div>
              <div>
                <p className="text-gray-700">Humidity: <strong>{weatherData.humidity}</strong></p>
                <p className="text-gray-600">Wind: {weatherData.windSpeed}</p>
              </div>
              <div>
                <p className="text-gray-700">Pressure: <strong>{weatherData.pressure}</strong></p>
                <p className="text-blue-700 font-medium">💡 {weatherData.advice}</p>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Timeline */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {forecast.map((item, index) => (
            <div
              key={index}
              className="bg-green-100 rounded-lg text-center p-4 shadow hover:shadow-lg transition"
            >
              <p className="font-semibold text-green-800">{item.day}</p>
              <p className="text-lg text-gray-700">{item.temp}</p>
              <p className="text-sm text-gray-500">{item.status}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
