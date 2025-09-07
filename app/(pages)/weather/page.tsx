'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "@/components/navBar";

export default function Home() {
  const [city, setCity] = useState("Nagpur,IN"); // default city
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "969319db1fb8e194b5d514f495cbdb5d"; // 🔑 Replace with your OpenWeatherMap key

  async function fetchWeather(selectedCity: string) {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
    } catch (err) {
      setError("City not found. Try again!");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  // fetch default city on load
  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchWeather(city);
    }
  };

  return (
    <>
    <NavBar />
    <div className=" flex flex-col items-center justify-center p-2">
      {/* Search bar */}
      <div className="flex gap-2 mb-6 w-full max-w-md">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="flex-1 p-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-lime-500 text-white rounded-lg shadow hover:bg-lime-600"
        >
          Search
        </button>
      </div>

      {/* Loading/Error States */}
      {loading && <p className="text-center">Loading weather...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Weather Data */}
      {weather && !loading && (
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 gap-6">
          {/* Left Section */}
          <div className="text-center flex flex-col justify-center">
            <h2 className="text-8xl text-lime-500 font-bold">
              {Math.round(weather.list[0].main.temp)}°
            </h2>
            <p className="text-2xl mt-2">{weather.list[0].weather[0].main}</p>
            <div className="flex justify-center mt-4 space-x-4 text-gray-600">
              <p>💨 {weather.list[0].wind.speed} m/s</p>
              <p>💧 {weather.list[0].main.humidity}%</p>
            </div>
          </div>

          {/* Right Section */}
          <div>
            <h3 className="text-lg font-semibold">Weather in {weather.city.name}</h3>
            <p className="text-sm mb-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-xl text-lime-500">
              {Math.round(weather.list[0].main.temp)}° (Feels like {Math.round(weather.list[0].main.feels_like)}°)
            </p>
            <p className="text-gray-600">{weather.list[0].weather[0].main}</p>

            <h4 className="mt-6  font-semibold">Hourly Forecast</h4>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {weather.list.slice(0, 6).map((h: any, i: number) => (
                <div key={i} className="bg-gray-100 p-3 text-lime-500 rounded-lg text-center">
                  <p className="font-semibold">{new Date(h.dt * 1000).getHours()}:00</p>
                  <p className="text-lg ">{Math.round(h.main.temp)}°</p>
                  <p className="text-sm  text-gray-500">{h.weather[0].main}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Forecast */}
          <div className="col-span-2 mt-8">
            <h4 className="font-semibold text-lg mb-3">5-Day Forecast</h4>
            <div className="grid grid-cols-5 gap-4">
              {weather.list
                .filter((_: any, i: number) => i % 8 === 0)
                .map((d: any, i: number) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 text-center shadow-sm">
                    <p className="font-medium">
                      {new Date(d.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <p className="text-xl text-lime-500 font-bold">{Math.round(d.main.temp)}°</p>
                    <p className="text-sm text-gray-500">{d.weather[0].main}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
