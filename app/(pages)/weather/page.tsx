'use client';

import React, { useState } from 'react';
import NavBar from '@/components/navBar';

export default function WeatherPage() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState({
    location: 'Nagpur, Maharashtra',
    temp: '31°C',
    condition: 'Partly Cloudy',
    humidity: '45%',
    advice: 'Ideal for irrigation',
  });

  const forecast = [
    { day: 'Mon', temp: '30°C', status: 'Sunny' },
    { day: 'Tue', temp: '32°C', status: 'Cloudy' },
    { day: 'Wed', temp: '29°C', status: 'Rain' },
    { day: 'Thu', temp: '31°C', status: 'Sunny' },
    { day: 'Fri', temp: '30°C', status: 'Cloudy' },
  ];

  const handleSearch = () => {
    // In real app, call API here and update state
    console.log(`Fetching weather for ${location}...`);
    setWeatherData((prev) => ({
      ...prev,
      location: location || 'Nagpur, Maharashtra',
    }));
  };

  return (
    <main className='bg-gradient-to-br from-lime-50 to-green-50 min-h-screen'>
        <NavBar />
      <section className="max-w-5xl mx-auto text-center py-24">
        <h1 className="text-6xl mb-10 font-bold text-lime-500">Live Weather Forecast</h1>
        <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
          Stay prepared with accurate and region-specific weather updates to protect your yield.
        </p>

        {/* Location Search */}
        <div className="mt-8 flex justify-center gap-4">
          <input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-64"
          />
          <button
            onClick={handleSearch}
            className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600 transition"
          >
            Get Weather
          </button>
        </div>
      </section>

      {/* Weather Card */}
      <section className="max-w-5xl mx-auto mb-10">
        <div className="bg-white shadow-md rounded-xl p-6 mb-6 text-center">
          <h2 className="text-2xl font-semibold text-green-700 mb-2">{weatherData.location}</h2>
          <p className="text-gray-700 text-lg">Current Temperature: {weatherData.temp}</p>
          <p className="text-gray-600">{weatherData.condition}, Humidity: {weatherData.humidity}</p>
          <p className="mt-2 text-sm text-blue-700 font-medium">Advice: {weatherData.advice}</p>
        </div>

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
